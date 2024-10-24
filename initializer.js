const setupComponent = (() => {
    const INITIALIZED_DATA_KEY = '_intlzd';

    function wrapInitializer(initializer) {
        return function (node) {
            if (node.dataset[INITIALIZED_DATA_KEY]) {
                return;
            }
            node.dataset[INITIALIZED_DATA_KEY] = true;
            initializer(node);
        }
    }

    const initializerMap = new Map();
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!('matches' in node)) {
                    continue;
                }
                for (const [selector, initializer] of initializerMap) {
                    if (node.matches(selector)) {
                        initializer(node);
                    } else {
                        Array.from(node.querySelectorAll(selector)).forEach(initializer);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true
    });

    return function (selector, initializer) {
        const finalInitializer = wrapInitializer(initializer);
        document.querySelectorAll(selector).forEach(finalInitializer);

        initializerMap.set(selector, finalInitializer);
    }
})()
