import React from "react";
import renderer from "react-test-renderer";
import { check } from "../../core/check";
import Footer from "../../web/components/footer";

window.innerWidth = 1024;
const longFooter = renderer.create(<Footer />);
const longCopyright = longFooter.root.findAllByProps({ children: "Copyright © 2023 jewl.app" });
check("Long footer should contain long copyright", longCopyright.length === 1);
const longContact = longFooter.root.findAllByProps({ children: "Contact" });
check("Long footer should contain long contact button", longContact.length === 1);
const longTerms = longFooter.root.findAllByProps({ children: "Terms of Service" });
check("Long footer should contain long terms button", longTerms.length === 1);
const longPrivacy = longFooter.root.findAllByProps({ children: "Privacy Policy" });
check("Long footer should contain long privacy button", longPrivacy.length === 1);

window.innerWidth = 512;
const shortFooter = renderer.create(<Footer />);
const shortCopyright = shortFooter.root.findAllByProps({ children: "© 2023" });
check("Short footer should contain short copyright", shortCopyright.length === 1);
const shortContact = shortFooter.root.findAllByProps({ children: "Contact" });
check("Short footer should contain short contact button", shortContact.length === 1);
const shortTerms = shortFooter.root.findAllByProps({ children: "ToS" });
check("Short footer should contain short terms button", shortTerms.length === 1);
const shortPrivacy = shortFooter.root.findAllByProps({ children: "PP" });
check("Short footer should contain short privacy button", shortPrivacy.length === 1);
