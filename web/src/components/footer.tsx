import "../styles/footer.css";
import type { ReactElement } from "react";
import React, { useCallback, useRef, useState, useMemo } from "react";
import { marked } from "marked";
import { sanitize } from "dompurify";

export const Footer = (): ReactElement => {
    const [legalText, setLegalText] = useState<string | null>(null);
    const legalDiv = useRef<HTMLDivElement>(null);

    const sendEmail = useCallback(() => {
        window.location.href = "mailto:contact@jewl.app";
    }, []);

    const openPage = useMemo(() => {
        return (name: string): void => {
            window.fetch(`./${name}.md`)
                .then(async x => x.text())
                .then(setLegalText)
                .catch(console.error);
        };
    }, []);

    const openTerms = useCallback(() => openPage("terms"), [openPage]);
    const openFaq = useCallback(() => openPage("faq"), [openPage]);
    const openPrivacy = useCallback(() => openPage("privacy"), [openPage]);

    const closeModal = useCallback(() => {
        legalDiv.current?.scrollTo({ top: 0 });
        setLegalText(null);
    }, []);

    return (
        <div className="footer">
            <div className="footer-content-long">
                <span className="footer-left">Copyright © 2023 jewl.app</span>
                <span className="footer-right" onClick={sendEmail}>Contact</span>
                <span className="footer-right" onClick={openFaq}>Frequently Asked Questions</span>
                <span className="footer-right" onClick={openTerms}>Terms of Service</span>
                <span className="footer-right" onClick={openPrivacy}>Privacy Policy</span>
            </div>
            <div className="footer-content-short">
                <span className="footer-left">© 2023 jewl.app</span>
                <span className="footer-right" onClick={sendEmail}>Contact</span>
                <span className="footer-right" onClick={openFaq}>FAQ</span>
                <span className="footer-right" onClick={openTerms}>ToC</span>
                <span className="footer-right" onClick={openPrivacy}>PP</span>
            </div>
            <div className="footer-legal-overlay" hidden={legalText == null} onClick={closeModal} />
            <div className="footer-legal-popup" hidden={legalText == null} ref={legalDiv}>
                <div dangerouslySetInnerHTML={{ __html: sanitize(marked.parse(legalText ?? "")) }} />
            </div>
        </div>
    );
};
