import "../styles/footer.css";
import type { ReactElement } from "react";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import { marked } from "marked";
import { sanitize, addHook } from "dompurify";
import { Popup } from "./popup";

export const Footer = (): ReactElement => {
    const [legalText, setLegalText] = useState<string | null>(null);

    useEffect(() => {
        addHook("afterSanitizeAttributes", (node: Element) => {
            if ("target" in node) {
                node.setAttribute("target", "_blank");
                node.setAttribute("rel", "noopener");
            }
        });
    }, []);

    const openPage = useMemo(() => {
        return (name: string): void => {
            window.fetch(`./${name}.md`)
                .then(async x => x.text())
                .then(setLegalText)
                .catch(console.error);
        };
    }, []);

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

    const html = useMemo(() => {
        if (legalText == null) { return undefined; }
        const parsed = marked.parse(legalText, { renderer: markedRenderer });
        const sanitized = sanitize(parsed);
        return { __html: sanitized };
    }, [legalText]);

    const openContact = useCallback(() => openPage("contact"), [openPage]);
    const openTerms = useCallback(() => openPage("terms"), [openPage]);
    const openFaq = useCallback(() => openPage("faq"), [openPage]);
    const openPrivacy = useCallback(() => openPage("privacy"), [openPage]);

    const closeModal = useCallback(() => setLegalText(null), []);

    return (
        <div className="footer">
            <div className="footer-content-long">
                <span className="footer-left">Copyright © 2023 jewl.app</span>
                <span className="footer-right" onClick={openContact}>Contact</span>
                <span className="footer-right" onClick={openFaq}>Frequently Asked Questions</span>
                <span className="footer-right" onClick={openTerms}>Terms of Service</span>
                <span className="footer-right" onClick={openPrivacy}>Privacy Policy</span>
            </div>
            <div className="footer-content-short">
                <span className="footer-left">© 2023 jewl.app</span>
                <span className="footer-right" onClick={openContact}>Contact</span>
                <span className="footer-right" onClick={openFaq}>FAQ</span>
                <span className="footer-right" onClick={openTerms}>ToS</span>
                <span className="footer-right" onClick={openPrivacy}>PP</span>
            </div>
            <Popup hidden={legalText == null} onClick={closeModal}>
                <div className="footer-legal" dangerouslySetInnerHTML={html} />
            </Popup>
        </div>
    );
};
