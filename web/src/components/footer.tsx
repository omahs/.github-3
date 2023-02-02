import "../styles/footer.css";
import type { ReactElement } from "react";
import React, { useCallback, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export const Footer = (): ReactElement => {
    const [legalText, setLegalText] = useState<string | null>(null);
    const legalDiv = useRef<HTMLDivElement>(null);

    const sendEmail = useCallback(() => {
        window.location.href = "mailto:contact@jewl.app";
    }, []);

    const openTerms = useCallback(() => {
        window.fetch("./terms.md")
            .then(async x => x.text())
            .then(setLegalText)
            .catch(console.log);
    }, []);

    const openPrivacy = useCallback(() => {
        window.fetch("./privacy.md")
            .then(async x => x.text())
            .then(setLegalText)
            .catch(console.log);
    }, []);

    const closeModal = useCallback(() => {
        legalDiv.current?.scrollTo({ top: 0 });
        setLegalText(null);
    }, []);

    return (
        <div className="footer">
            <div className="footer-content">
                <span className="footer-left-long">Copyright © 2023 jewl.app</span>
                <span className="footer-left-short">© 2023</span>
                <span className="footer-right" onClick={openPrivacy}>Privacy Policy</span>
                <span className="footer-right" onClick={openTerms}>Terms of Service</span>
                <span className="footer-right" onClick={sendEmail}>Contact</span>
            </div>
            <div className="footer-legal-overlay" hidden={legalText == null} onClick={closeModal} />
            <div className="footer-legal-popup" hidden={legalText == null} ref={legalDiv}>
                <ReactMarkdown>{legalText ?? ""}</ReactMarkdown>
            </div>
        </div>
    );
};
