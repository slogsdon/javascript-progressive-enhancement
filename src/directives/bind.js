// @ts-check

import Observable from "../observable.js";

/**
 * Implements the `bind` directive, allowing elements to subscribe to changes
 * to an observable value
 *
 * @param {Record<string, Observable>} context
 * @param {Element} el
 * @param {string} key
 */
export default function bindDirective(context, el, key) {
    if (!Object.hasOwnProperty.call(context, key) || !(context[key] instanceof Observable)) {
        context[key] = new Observable(context[key]);
    }

    /**
     * @param {any} value
     * @returns
     */
    function handler(value) {
        if (!value) {
            value = "";
        }

        if (el instanceof HTMLInputElement) {
            el.value = value;
            return;
        }

        el.childNodes.forEach((child) => el.removeChild(child));
        el.appendChild(document.createTextNode(value));
    }

    // handle initial case
    handler(context[key].value);
    // handle future changes
    context[key].subscribe(handler);
}
