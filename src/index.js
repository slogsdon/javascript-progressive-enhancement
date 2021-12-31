// @ts-check

import { defineDirective } from "./directive.js";
import bindDirective from "./directives/bind.js";
import dataDirective from "./directives/data.js";
import modelDirective from "./directives/model.js";

export default class ProgressiveEnhancement {
    static get directives() {
        return [
            // order matters
            { name: "data", setupFn: dataDirective },
            // order doesn't matter
            { name: "bind", setupFn: bindDirective },
            { name: "model", setupFn: modelDirective }
        ]
    }

    static init() {
        for (const i in ProgressiveEnhancement.directives) {
            if (Object.hasOwnProperty.call(ProgressiveEnhancement.directives, i)) {
                const directive = ProgressiveEnhancement.directives[i];
                defineDirective(directive.name, directive.setupFn);
            }
        }
    }
}
