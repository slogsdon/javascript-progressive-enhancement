// @ts-check

/**
 * @param {Element} target
 * @param {string} action
 * @param {HTMLTemplateElement} template
 */
function applyUpdate(target, action, template) {
    target.dispatchEvent(new CustomEvent("pe:load-html:before-dom-update"));

    /**
     * @param {HTMLTemplateElement} temp
     * @returns
     */
    function getContent(temp) { return temp.content || temp; }

    switch (action) {
        case "replace":
            while (target.hasChildNodes()) {
                if (!target.firstChild) {
                    break;
                }

                target.removeChild(target.firstChild);
            }
            // fallthrough to "after" is intended
        case "after":
            while (getContent(template).hasChildNodes()) {
                const child = getContent(template).firstChild;

                if (!child) {
                    break;
                }

                target.appendChild(child);
            }
            break;
        case "before":
            while (getContent(template).hasChildNodes()) {
                const child = getContent(template).lastChild;

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
 * @param {{context: Record<string, any>, directive: string, target: Element, key: string}} data
 */
export default function loadHtmlDirective({context, directive, target, key}) {
    const url = target.getAttribute("data-url");

    if (!url) {
        return;
    }

    if (directive.indexOf(":") === -1) {
        directive += ":replace";
    }

    const [, action] = directive.split(":", 2);

    target.dispatchEvent(new CustomEvent("pe:load-html:before-request"));

    fetch(url, {
        headers: {
            "Content-Type": "text/vnd.pe-load-html.html"
        }
    })
        .then((resp) => {
            target.dispatchEvent(new CustomEvent("pe:load-html:after-request"));
            return resp.text();
        })
        .then((text) => {
            const templateHolder = document.createElement("div");
            templateHolder.innerHTML = text;

            const template = templateHolder.querySelector("template");

            if (!template) {
                target.dispatchEvent(new CustomEvent("pe:load-html:error", { detail: { reason: "" }}));
                return;
            }

            applyUpdate(target, action, template);
        })
        .catch((reason) => {
            target.dispatchEvent(new CustomEvent("pe:load-html:rerror", { detail: { reason }}));
        });
}
