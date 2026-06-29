/** Zentrale Navigationsliste — Menü-Änderungen: eno-nav-config.js + shared/css/eno-menu.css (+ eno-site-nav.js). */
window.ENO_SITE_NAV_ITEMS = [
    { id: "hub", label: "Startseite", href: "/" },
    { id: "abnehmguide", label: "Abnehmguide", soon: true },
    { id: "kalorienrechner", label: "Kalorienrechner", href: "/tools/kalorienrechner/" },
    { id: "makrorechner", label: "Makrorechner", href: "/tools/makrorechner/" },
    { id: "abnehmlexikon", label: "Abnehmlexikon", href: "/tools/abnehmlexikon/" },
    { id: "lieblingsuebungen", label: "Lieblingsübungen", soon: true },
    {
        id: "patreon",
        label: "Patreon",
        href: "https://www.patreon.com/cw/enorocks",
        external: true,
    },
];
