(function () {
    var config = window.ENO_ANALYTICS;
    if (!config || !config.enabled || !config.domain) {
        return;
    }

    var script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = config.domain;
    script.src = config.scriptSrc || 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
})();
