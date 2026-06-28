(function () {
    var documentListenersBound = false;

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function renderNavItems(items) {
        return items
            .map(function (item) {
                var label = escapeHtml(item.label);
                var itemClass =
                    "eno-site-nav__item eno-site-nav__item--" + item.id;
                var dataId = ' data-eno-nav-id="' + escapeHtml(item.id) + '"';

                if (item.href && !item.soon) {
                    var external = item.external
                        ? ' target="_blank" rel="noopener noreferrer"'
                        : "";
                    return (
                        "<li class=\"" +
                        itemClass +
                        "\"" +
                        dataId +
                        "><a href=\"" +
                        item.href +
                        "\"" +
                        external +
                        ">" +
                        label +
                        "</a></li>"
                    );
                }

                var badge = item.soon
                    ? '<span class="eno-site-nav__badge">Bald</span>'
                    : "";
                return (
                    "<li class=\"" +
                    itemClass +
                    " is-soon\"" +
                    dataId +
                    "><span class=\"eno-site-nav__soon\">" +
                    label +
                    badge +
                    "</span></li>"
                );
            })
            .join("");
    }

    function renderNavMarkup(panelId) {
        var items = window.ENO_SITE_NAV_ITEMS || [];

        return (
            '<button type="button" class="eno-site-nav__toggle" aria-label="Menü" aria-haspopup="true" aria-expanded="false" aria-controls="' +
            panelId +
            '">' +
            '<span class="eno-site-nav__icon" aria-hidden="true"></span>' +
            "</button>" +
            '<div class="eno-site-nav__panel" id="' +
            panelId +
            '" hidden>' +
            '<nav aria-label="Navigation">' +
            '<ul class="eno-site-nav__list">' +
            renderNavItems(items) +
            "</ul>" +
            "</nav>" +
            "</div>"
        );
    }

    function bindDocumentListeners() {
        if (documentListenersBound) {
            return;
        }
        documentListenersBound = true;

        document.addEventListener("click", function (event) {
            document.querySelectorAll(".eno-site-nav.is-open").forEach(function (navRoot) {
                if (navRoot.contains(event.target)) {
                    return;
                }
                navRoot.classList.remove("is-open");
                var toggle = navRoot.querySelector(".eno-site-nav__toggle");
                var panel = navRoot.querySelector(".eno-site-nav__panel");
                if (toggle) {
                    toggle.setAttribute("aria-expanded", "false");
                }
                if (panel) {
                    panel.hidden = true;
                }
            });
        });

        document.addEventListener("keydown", function (event) {
            if (event.key !== "Escape") {
                return;
            }
            document.querySelectorAll(".eno-site-nav.is-open").forEach(function (navRoot) {
                navRoot.classList.remove("is-open");
                var toggle = navRoot.querySelector(".eno-site-nav__toggle");
                var panel = navRoot.querySelector(".eno-site-nav__panel");
                if (toggle) {
                    toggle.setAttribute("aria-expanded", "false");
                }
                if (panel) {
                    panel.hidden = true;
                }
            });
        });
    }

    function initBehavior(navRoot) {
        var toggle = navRoot.querySelector(".eno-site-nav__toggle");
        var panel = navRoot.querySelector(".eno-site-nav__panel");

        if (!toggle || !panel) {
            return;
        }

        toggle.addEventListener("click", function (event) {
            event.stopPropagation();
            var isOpen = navRoot.classList.contains("is-open");
            if (isOpen) {
                navRoot.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
                panel.hidden = true;
            } else {
                navRoot.classList.add("is-open");
                toggle.setAttribute("aria-expanded", "true");
                panel.hidden = false;
            }
        });

        bindDocumentListeners();
    }

    function markCurrentNavItem(scope) {
        var path = window.location.pathname.replace(/\/$/, "") || "/";
        (scope || document).querySelectorAll(".eno-site-nav__item[data-eno-nav-id]").forEach(function (li) {
            var link = li.querySelector("a[href]");
            if (!link) {
                li.classList.remove("is-current");
                return;
            }
            var href = link.getAttribute("href");
            if (!href || href.indexOf("http") === 0) {
                li.classList.remove("is-current");
                return;
            }
            var linkPath = href.replace(/\/$/, "") || "/";
            li.classList.toggle("is-current", linkPath === path);
        });
    }

    function mount(container) {
        if (!container) {
            return;
        }

        if (container.querySelector(".eno-site-nav__toggle")) {
            return;
        }

        var panelId =
            container.getAttribute("data-eno-nav-panel") ||
            "eno-nav-" + Math.random().toString(36).slice(2, 10);

        container.classList.add("eno-site-nav");
        container.innerHTML = renderNavMarkup(panelId);
        initBehavior(container);
        markCurrentNavItem(container);
    }

    function mountAll(root) {
        var scope = root || document;
        scope.querySelectorAll("[data-eno-nav]").forEach(mount);
    }

    window.EnoSiteNav = {
        mount: mount,
        mountAll: mountAll,
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            mountAll(document);
        });
    } else {
        mountAll(document);
    }
})();
