// @ts-check

/**
 * A value that allows others to subscribe to data changes
 */
export default class Observable {
    /**
     * @constructor
     * @param {any} value
     */
    constructor(value) {
        /**
         * @private
         */
        this._value = value;
        /**
         * @private
         * @type {Array<(value:any) => void>}
         */
        this._subscribers = [];
    }

    /**
     * Adds a new subscriber for data changes
     *
     * @param {(value:any) => void} fn
     */
    subscribe(fn) {
        this._subscribers.push(fn);
    }

    /**
     * Notifies all subscribers of the current value
     */
    notify() {
        this._subscribers.forEach((fn) => fn(this._value))
    }

    /**
     * Gets the current value
     */
    get value() {
        return this._value;
    }

    /**
     * Sets the current value, and notifies subscribers of any changes
     */
    set value(v) {
        if (v !== this._value) {
            this._value = v;
            this.notify();
        }
    }
}
