// @ts-check

import {
    PROGRESSIVEENHANCEMENT_DATA_CONTEXT_NAME,
    upgradeDataContext
} from "../data-context.js"

/**
 * Implements the `data` directive, creating a scoped data context for use by child elements
 *
 * @param {{context: Record<string, any>, directive: string, el: Element, key: string}} data
 */
export default function dataDirective({el, key}) {
    const data = key || "{}";
    /** @type {any} */ (el)[PROGRESSIVEENHANCEMENT_DATA_CONTEXT_NAME] = upgradeDataContext(new Function(`return ${data}`)());
}
