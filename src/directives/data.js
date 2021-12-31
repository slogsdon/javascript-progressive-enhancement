// @ts-check

import {
    PROGRESSIVEENHANCEMENT_DATA_CONTEXT_NAME,
    upgradeDataContext
} from "../data-context.js"

/**
 * Implements the `data` directive, creating a scoped data context for use by child elements
 *
 * @param {any} context
 * @param {Element} el
 * @param {string} value
 */
export default function dataDirective(context, el, value) {
    /** @type {any} */ (el)[PROGRESSIVEENHANCEMENT_DATA_CONTEXT_NAME] = upgradeDataContext(new Function(`return ${value}`)());
}
