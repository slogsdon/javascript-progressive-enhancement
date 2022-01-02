// @ts-check

/**
 * @param {Element} target
 * @param {string} action
 * @param {HTMLTemplateElement} template
 */
function handleUpdate(target, action, template) {
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
        case "before":
            const isAfter = action === "after";
            while (template.content.hasChildNodes()) {
                const child = isAfter ? template.content.firstChild : template.content.lastChild;

                if (!child) {
                    break;
                }

                isAfter ? target.appendChild(child) : target.insertBefore(child, target.firstChild);
            }
            break;
    }
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

    fetch(url, {
        headers: {
            "Content-Type": "text/vnd.pe-load-html.html"
        }
    })
        .then((resp) => resp.text())
        .then((text) => {
            const templateHolder = document.createElement("div");
            templateHolder.innerHTML = text;

            const template = templateHolder.querySelector("template");

            if (!template) {
                return;
            }

            handleUpdate(el, action, template);
        });
}
