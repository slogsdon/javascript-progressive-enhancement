// @ts-check

import Observable from "../observable.js";

/**
 * Implements the `bind` directive, allowing elements to subscribe to changes
 * to an observable value
 *
 * @param {{context: Record<string, Observable>, directive: string, el: Element, key: string}} data
 */
export default function bindDirective({context, directive, el, key}) {
    if (!Object.hasOwnProperty.call(context, key) || !(context[key] instanceof Observable)) {
        context[key] = new Observable(context[key]);
    }

    if (directive.indexOf(":") === -1) {
        directive += ":text";
    }

    const [, targetAttribute] = directive.split(":", 2);

    /**
     * @param {any} value
     * @returns
     */
    function handler(value) {
        if (!value) {
            value = "";
        }

        switch (targetAttribute) {
            case "class":
                el.className = value;
                break;
            case "text":
            case "value":
                if (el instanceof HTMLInputElement) {
                    el.value = value;
                    return;
                }

                el.childNodes.forEach((child) => el.removeChild(child));
                el.appendChild(document.createTextNode(value));
                break;
            default:
                el.setAttribute(targetAttribute, value);
                break;
        }
    }

    // handle initial case
    handler(context[key].value);
    // handle future changes
    context[key].subscribe(handler);
}
