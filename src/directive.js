// @ts-check

/**
 * @typedef {import("./observable").default} Observable
 */

import { findDataContext } from "./data-context.js";

function findElements() {
    return Array.from(document.querySelectorAll('*'));
}

let elements = findElements();

/**
 * @param {Element} el
 * @param {string} prefix
 * @returns {Array<string>}
 */
function findAttributesPrefixedWith(el, prefix) {
    return Array.from(el.attributes)
        .map((att) => att.name)
        .filter((att) => att.startsWith(prefix))
}

/**
 * @param {string} prefix
 * @returns {(el: Element) => boolean}
 */
function hasAttributeStartingWith(prefix) {
    return (el) => {
        return findAttributesPrefixedWith(el, prefix).length > 0;
    };
}

/**
 * @param {string} name
 * @param {(data: {context: Record<string, Observable>, directive: string, target: Element, key: string}) => void} fn
 * @param {boolean} [refresh]
 */
export function defineDirective(name, fn, refresh) {
    if (refresh === true) {
        elements = findElements();
    }

    const directiveName = `pe-${name}`;

    elements.filter(hasAttributeStartingWith(directiveName)).forEach((target) => {
        const attributeName = (findAttributesPrefixedWith(target, directiveName) || [directiveName])[0];
        const key = target.getAttribute(attributeName) || "";
        fn({
            context: findDataContext(target.parentElement),
            directive: attributeName,
            target,
            key,
        });
    });
}
