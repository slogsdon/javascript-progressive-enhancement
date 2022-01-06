// @ts-check

import Observable from "../observable.js";
import bindDirective from "./bind.js";

/**
 * Updates an observable value when an `input` changes
 *
 * @param {Record<string, Observable>} context
 * @param {Element} target
 * @param {string} key
 */
function setData(context, target, key) {
    if (!Object.hasOwnProperty.call(context, key) || !(context[key] instanceof Observable)) {
        context[key] = new Observable(context[key]);
    }

    if (target instanceof HTMLInputElement) {
        target.addEventListener("input", () => {
            target.dispatchEvent(new CustomEvent("pe:model:before-update", { detail: { value: target.value } }));
            context[key].value = target.value;
            target.dispatchEvent(new CustomEvent("pe:model:update", { detail: { value: target.value } }));
            target.dispatchEvent(new CustomEvent("pe:model:after-update", { detail: { value: target.value } }));
        });
    }
}

/**
 * Implements the `model` directive, allowing elements to update an observable
 * value as well as subscribe to changes to it
 *
 * @param {{context: Record<string, Observable>, directive: string, target: Element, key: string}} data
 */
export default function modelDirective(data) {
    const {context, target, key} = data;
    setData(context, target, key);
    bindDirective(data);
}
