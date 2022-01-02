// @ts-check

import Observable from "../observable.js";
import bindDirective from "./bind.js";

/**
 * Updates an observable value when an `input` changes
 *
 * @param {Record<string, Observable>} context
 * @param {Element} el
 * @param {string} key
 */
function setData(context, el, key) {
    if (!Object.hasOwnProperty.call(context, key) || !(context[key] instanceof Observable)) {
        context[key] = new Observable(context[key]);
    }

    if (el instanceof HTMLInputElement) {
        el.addEventListener("input", () => {
            context[key].value = el.value;
        });
    }
}

/**
 * Implements the `model` directive, allowing elements to update an observable
 * value as well as subscribe to changes to it
 *
 * @param {{context: Record<string, Observable>, directive: string, el: Element, key: string}} data
 */
export default function modelDirective(data) {
    const {context, el, key} = data;
    setData(context, el, key);
    bindDirective(data);
}
