// @ts-check

import Observable from "../observable.js";

/**
 * Implements the `bind` directive, allowing elements to subscribe to changes
 * to an observable value
 *
 * @param {{context: Record<string, Observable>, directive: string, target: Element, key: string}} data
 */
export default function bindDirective({context, directive, target, key}) {
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
        target.dispatchEvent(new CustomEvent("pe:model:before-update", { detail: { value } }));

        if (!value) {
            value = "";
        }

        switch (targetAttribute) {
            case "class":
                target.className = value;
                break;
            case "text":
            case "value":
                if (target instanceof HTMLInputElement) {
                    target.value = value;
                } else {
                    target.childNodes.forEach((child) => target.removeChild(child));
                    target.appendChild(document.createTextNode(value));
                }
                break;
            default:
                target.setAttribute(targetAttribute, value);
                break;
        }

        target.dispatchEvent(new CustomEvent("pe:model:update", { detail: { value } }));
        target.dispatchEvent(new CustomEvent("pe:model:after-update", { detail: { value } }));
    }

    // handle initial case
    handler(context[key].value);
    // handle future changes
    context[key].subscribe(handler);
}
