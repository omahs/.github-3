import "../styles/legal.css";
import type { ReactElement } from "react";
import React, { useMemo, useEffect, useCallback } from "react";
import { addHook, sanitize } from "dompurify";
import { useNavigation } from "../modules/navigation";
import { marked } from "marked";

const Legal = (): ReactElement => {
    const { legalText, setLegalText } = useNavigation();

    useEffect(() => {
        addHook("afterSanitizeAttributes", (node: Element) => {
            if ("target" in node) {
                node.setAttribute("target", "_blank");
                node.setAttribute("rel", "noopener");
            }
        });
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

    const closeModal = useCallback(() => setLegalText(), [setLegalText]);

    return (
        <>
            <div className="legal-overlay" onClick={closeModal} />
            <div className="legal-popup" dangerouslySetInnerHTML={html} />
        </>
    );
};

const OptionalLegal = (): ReactElement | null => {
    const { legalText } = useNavigation();
    return legalText == null ? null : <Legal />;
};

export default OptionalLegal;
