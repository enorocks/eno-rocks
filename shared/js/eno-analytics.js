(function () {
    var config = window.ENO_ANALYTICS;
    if (!config || !config.enabled || !config.endpoint) {
        return;
    }

    var script = document.createElement('script');
    script.async = true;
    script.dataset.goatcounter = config.endpoint;
    script.src = config.scriptSrc || 'https://gc.zgo.at/count.js';
    document.head.appendChild(script);
})();
