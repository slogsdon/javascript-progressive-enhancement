// @ts-check

/**
 * @param {Element} target
 * @param {string} action
 * @param {HTMLTemplateElement} template
 */
function handleUpdate(target, action, template) {
    target.dispatchEvent(new CustomEvent("pe:load-html:before-dom-update"));

    switch (action) {
        case "replace":
            while (target.hasChildNodes()) {
                if (!target.firstChild) {
                    break;
                }

                target.removeChild(target.firstChild);
            }
            // fallthrough is intended
        case "after":
            while (template.content.hasChildNodes()) {
                const child = template.content.firstChild;

                if (!child) {
                    break;
                }

                target.appendChild(child);
            }
            break;
        case "before":
            while (template.content.hasChildNodes()) {
                const child = template.content.lastChild;

                if (!child) {
                    break;
                }

                target.insertBefore(child, target.firstChild);
            }
            break;
    }

    target.dispatchEvent(new CustomEvent("pe:load-html:load"));
    target.dispatchEvent(new CustomEvent("pe:load-html:after-dom-update"));
}

/**
 * Implements the `load-html` directive, allowing HTML to be loaded asynchronously
 *
 * @param {{context: Record<string, any>, directive: string, el: Element, key: string}} data
 */
export default function loadHtmlDirective({context, directive, el, key}) {
    const url = el.getAttribute("data-url");

    if (!url) {
        return;
    }

    if (directive.indexOf(":") === -1) {
        directive += ":replace";
    }

    const [, action] = directive.split(":", 2);

    el.dispatchEvent(new CustomEvent("pe:load-html:before-request"));

    fetch(url, {
        headers: {
            "Content-Type": "text/vnd.pe-load-html.html"
        }
    })
        .then((resp) => {
            el.dispatchEvent(new CustomEvent("pe:load-html:after-request"));
            return resp.text();
        })
        .then((text) => {
            const templateHolder = document.createElement("div");
            templateHolder.innerHTML = text;

            const template = templateHolder.querySelector("template");

            if (!template) {
                el.dispatchEvent(new CustomEvent("pe:load-html:error", { detail: { reason: "" }}));
                return;
            }

            handleUpdate(el, action, template);
        })
        .catch((reason) => {
            el.dispatchEvent(new CustomEvent("pe:load-html:rerror", { detail: { reason }}));
        });
}
