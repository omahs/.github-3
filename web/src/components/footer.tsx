import "./footer.css";
import type { ReactElement } from "react";
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { ServerStatus } from "jewl-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCirclePause, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { addHook, sanitize } from "dompurify";
import { marked } from "marked";
import { apiClient } from "../modules/network";
import { useWindowSize } from "../modules/size";

/**
    The footer component that contains a couple of links and
    the server status. This status is fetched on load from
    the api. The links open a popup that renders some markdown
    text.
**/
const Footer = (): ReactElement => {
    const { width } = useWindowSize();
    const [legalText, setLegalText] = useState<string | null>(null);
    const [serverStatus, setServerStatus] = useState(ServerStatus.Up);

    useEffect(() => {
        addHook("afterSanitizeAttributes", (node: Element) => {
            if ("target" in node) {
                node.setAttribute("target", "_blank");
                node.setAttribute("rel", "noopener");
            }
        });
    }, []);

    useEffect(() => {
        apiClient.getStatus()
            .then(x => setServerStatus(x.status))
            .catch(() => setServerStatus(ServerStatus.Down));
    }, []);

    const statusClicked = useCallback(() => {
        window.open("https://status.jewl.app/", "_blank", "noopener,noreferrer");
    }, []);

    const openPage = useCallback((name: string) => {
        window.fetch(`./${name}.md`)
            .then(async x => x.text())
            .then(setLegalText)
            .catch(console.error);
    }, [setLegalText]);

    const closeModal = useCallback(() => setLegalText(null), [setLegalText]);
    const openContact = useCallback(() => openPage("contact"), [openPage]);
    const openTerms = useCallback(() => openPage("terms"), [openPage]);
    const openPrivacy = useCallback(() => openPage("privacy"), [openPage]);

    const isPhone = useMemo(() => {
        return width < 768;
    }, [width]);

    const statusMessage = useMemo(() => {
        if (isPhone) { return null; }
        switch (serverStatus) {
            case ServerStatus.Up: return <span>All systems operational</span>;
            case ServerStatus.Maintainance: return <span>Down for maintainance</span>;
            case ServerStatus.Down: return <span>Partially degraded service</span>;
            default: return null;
        }
    }, [serverStatus, isPhone]);

    const statusIcon = useMemo(() => {
        switch (serverStatus) {
            case ServerStatus.Up: return <FontAwesomeIcon icon={faCircleCheck} />;
            case ServerStatus.Maintainance: return <FontAwesomeIcon icon={faCirclePause} />;
            case ServerStatus.Down: return <FontAwesomeIcon icon={faCircleQuestion} />;
            default: return null;
        }
    }, [serverStatus]);

    const markedRenderer = useMemo(() => {
        const renderer = new marked.Renderer();
        const linkRenderer = renderer.link.bind(renderer);
        renderer.link = (href, title, text): string => {
            const localLink = href?.startsWith(`${location.protocol}//${location.hostname}`) ?? false;
            const link = linkRenderer.call(renderer, href, title, text);
            return localLink ? link : link.replace(/^<a /u, "<a target=\"_blank\" rel=\"noreferrer noopener nofollow\" ");
        };
        return renderer;
    }, []);

    const popup = useMemo(() => {
        if (legalText == null) { return null; }
        const parsed = marked.parse(legalText, { renderer: markedRenderer });
        const sanitized = sanitize(parsed);
        return (
            <>
                <div className="footer-legal-overlay" onClick={closeModal} />
                <div className="footer-legal-popup" dangerouslySetInnerHTML={{ __html: sanitized }} />
            </>
        );
    }, [legalText]);

    return (
        <div className="footer">
            <span className="footer-left">{isPhone ? "© 2023" : "Copyright © 2023 jewl.app" }</span>
            <span className="footer-middle" onClick={statusClicked}>{statusIcon}{statusMessage}</span>
            <div className="footer-right">
                <span onClick={openContact}>{isPhone ? "Contact" : "Contact"}</span>
                <span onClick={openTerms}>{isPhone ? "ToS" : "Terms of Service"}</span>
                <span onClick={openPrivacy}>{isPhone ? "PP" : "Privacy Policy"}</span>
            </div>
            {popup}
        </div>
    );
};

export default Footer;
