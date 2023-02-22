import "../styles/footer.css";
import type { ReactElement } from "react";
import React, { useCallback, useMemo } from "react";
import { useNavigation } from "../modules/navigation";

const Footer = (): ReactElement => {
    const { setLegalText } = useNavigation();

    const openPage = useMemo(() => {
        return (name: string): void => {
            window.fetch(`./${name}.md`)
                .then(async x => x.text())
                .then(setLegalText)
                .catch(console.error);
        };
    }, [setLegalText]);

    const openContact = useCallback(() => openPage("contact"), [openPage]);
    const openTerms = useCallback(() => openPage("terms"), [openPage]);
    const openFaq = useCallback(() => openPage("faq"), [openPage]);
    const openPrivacy = useCallback(() => openPage("privacy"), [openPage]);

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
        </div>
    );
};

export default Footer;
