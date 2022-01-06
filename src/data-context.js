// @ts-check

import Observable from "./observable.js";

export const PROGRESSIVEENHANCEMENT_DATA_CONTEXT_NAME = "__pe_data_context";

/**
 * @type {Record<string, Observable>}
 */
export const defaultDataContext = {};

/**
 * Traverses parent elements until a data context is found. If not found,
 * the global fallback data context is returned.
 *
 * @param {Element?} target
 * @returns {Record<string, Observable>}
 */
export function findDataContext(target) {
    let result = defaultDataContext;

    if (target && /** @type {any} */ (target)[PROGRESSIVEENHANCEMENT_DATA_CONTEXT_NAME]) {
        result = /** @type {any} */ (target)[PROGRESSIVEENHANCEMENT_DATA_CONTEXT_NAME];
    } else if (target && target.parentElement) {
        result = findDataContext(target.parentElement);
    }

    return result;
}

/**
 * Ensures all existing properties on an object are observable
 *
 * @param {Record<string, any>} data
 * @returns {Record<string, Observable>}
 */
export function upgradeDataContext(data) {
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            data[key] = new Observable(data[key]);
        }
    }

    return data;
}
