/** Entfernt alte Tool-PWAs (z. B. enoExercises) — eno.rocks-Hub-PWA bleibt unberührt. */
(function () {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        registrations.forEach(function (registration) {
            var scriptUrl = registration.active?.scriptURL ?? registration.installing?.scriptURL ?? '';
            if (scriptUrl.includes('/tools/') && scriptUrl.endsWith('/sw.js')) {
                registration.unregister();
            }
        });
    });
})();
