// @ts-check

/**
 * @typedef {import("./observable").default} Observable
 */

import { findDataContext } from "./data-context.js";

/**
 * @param {string} name
 * @param {(context: Record<string, Observable>, el: Element, key: string) => void} fn
 */
export function defineDirective(name, fn) {
    const directiveName = `pe-${name}`;

    document.querySelectorAll(`[${directiveName}]`).forEach((el) => {
        if (!el.hasAttribute(directiveName)) {
            return;
        }

        const key = el.getAttribute(directiveName) || "";
        fn(findDataContext(el.parentElement), el, key);
    });
}
