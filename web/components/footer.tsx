import "css:../styles/footer.css";
import contact from "url:../../public/contact.md";
import terms from "url:../../public/terms.md";
import privacy from "url:../../public/privacy.md";
import type { ReactElement } from "react";
import React, { useCallback, useMemo, useEffect, useState } from "react";
import dompurify from "dompurify";
import { marked } from "marked";
import { useWindowSize } from "../modules/size";

const Footer = (): ReactElement => {
    const { width } = useWindowSize();
    const [legalText, setLegalText] = useState<string | null>(null);

    useEffect(() => {
        dompurify.addHook("afterSanitizeAttributes", (node: Element) => {
            if ("target" in node) {
                node.setAttribute("target", "_blank");
                node.setAttribute("rel", "noopener noreferrer");
            }
        });
    }, []);

    const openModal = useCallback((url: string) => {
        window.fetch(url)
            .then(async x => x.text())
            .then(setLegalText)
            .catch(() => { /* Empty */ });
    }, [setLegalText]);

    const closeModal = useCallback(() => setLegalText(null), [setLegalText]);
    const contactClicked = useCallback(() => openModal(contact), [openModal]);
    const termsClicked = useCallback(() => openModal(terms), [openModal]);
    const privacyClicked = useCallback(() => openModal(privacy), [openModal]);

    const isPhone = useMemo(() => {
        return width < 768;
    }, [width]);

    const markedRenderer = useMemo(() => {
        const renderer = new marked.Renderer();
        const linkRenderer = renderer.link.bind(renderer);
        renderer.link = (href, title, text): string => {
            const localLink = href?.startsWith(`${location.protocol}//${location.hostname}`) ?? false;
            const link = linkRenderer.call(renderer, href, title, text);
            return localLink ? link : link.replace(/^<a /u, "<a target=\"_blank\"");
        };
        return renderer;
    }, []);

    const popup = useMemo(() => {
        if (legalText == null) { return null; }
        const parsed = marked.parse(legalText, { renderer: markedRenderer });
        const sanitized = dompurify.sanitize(parsed);
        return (
            <>
                <div className="footer-overlay" onClick={closeModal} />
                <div className="footer-popup" dangerouslySetInnerHTML={{ __html: sanitized }} />
            </>
        );
    }, [legalText]);

    return (
        <div className="footer">
            <span className="footer-left">{isPhone ? "© 2023" : "Copyright © 2023 jewl.app" }</span>
            <div className="footer-right">
                <button type="button" onClick={contactClicked}>{isPhone ? "Contact" : "Contact"}</button>
                <button type="button" onClick={termsClicked}>{isPhone ? "ToS" : "Terms of Service"}</button>
                <button type="button" onClick={privacyClicked}>{isPhone ? "PP" : "Privacy Policy"}</button>
            </div>
            {popup}
        </div>
    );
};

export default Footer;
