// @ts-check

import {
    PROGRESSIVEENHANCEMENT_DATA_CONTEXT_NAME,
    upgradeDataContext
} from "../data-context.js"

/**
 * Implements the `data` directive, creating a scoped data context for use by child elements
 *
 * @param {{context: Record<string, any>, directive: string, target: Element, key: string}} data
 */
export default function dataDirective({target, key}) {
    const data = key || "{}";
    /** @type {any} */ (target)[PROGRESSIVEENHANCEMENT_DATA_CONTEXT_NAME] = upgradeDataContext(new Function(`return ${data}`)());
}
