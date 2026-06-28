/** Zentrale Navigationsliste — Menü-Änderungen: eno-nav-config.js + shared/css/eno-menu.css (+ eno-site-nav.js). */
window.ENO_SITE_NAV_ITEMS = [
    { id: "hub", label: "Startseite", href: "/" },
    { id: "dailytogether", label: "DailyTogether", href: "/tools/dailytogether/" },
    { id: "pedia", label: "enoPedia", href: "/tools/pedia/" },
    { id: "kalorienrechner", label: "enoCalories", href: "/tools/kalorienrechner/" },
    { id: "makrorechner", label: "enoMacros", href: "/tools/makrorechner/" },
    { id: "uebungen", label: "enoExercises", soon: true },
    {
        id: "patreon",
        label: "Patreon",
        href: "https://www.patreon.com/cw/enorocks",
        external: true,
    },
];
