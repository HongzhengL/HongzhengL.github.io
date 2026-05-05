(() => {
    const helpers = {};

    const BASE_PATH = (() => {
        const path = window.location.pathname;
        const match = path.match(/^(\/~[^/]+\/)/);
        return match ? match[1] : "/";
    })();

    function getInnerPath(fullPath) {
        const path = fullPath || window.location.pathname;
        if (path.startsWith(BASE_PATH)) {
            return "/" + path.slice(BASE_PATH.length);
        }
        return path;
    }

    helpers.getCurrentLanguage = function getCurrentLanguage() {
        const langAttr = document.documentElement.lang || "";
        if (langAttr.toLowerCase().startsWith("zh")) {
            return "zh";
        }
        const inner = getInnerPath();
        return inner.startsWith("/zh/") || inner === "/zh" ? "zh" : "en";
    };

    helpers.getOppositeLanguage = function getOppositeLanguage() {
        return helpers.getCurrentLanguage() === "zh" ? "en" : "zh";
    };

    helpers.getOppositeLanguageUrl = function getOppositeLanguageUrl(
        currentPath,
    ) {
        const inner = getInnerPath(currentPath);
        const isChinese = helpers.getCurrentLanguage() === "zh";

        if (!isChinese) {
            if (inner === "/" || inner.endsWith("/index.html")) {
                return BASE_PATH + "zh/index.html";
            }
            if (inner.endsWith("/course-review.html")) {
                return BASE_PATH + "zh/course-review.html";
            }
            if (inner.endsWith("/my-work.html")) {
                return BASE_PATH + "zh/my-work.html";
            }
            return BASE_PATH + "zh/index.html";
        }

        if (
            inner === "/zh" ||
            inner.endsWith("/zh/") ||
            inner.endsWith("/zh/index.html")
        ) {
            return BASE_PATH + "index.html";
        }
        if (inner.endsWith("/zh/course-review.html")) {
            return BASE_PATH + "course-review.html";
        }
        if (inner.endsWith("/zh/my-work.html")) {
            return BASE_PATH + "my-work.html";
        }
        return BASE_PATH + "index.html";
    };

    helpers.setLanguagePreference = function setLanguagePreference(language) {
        try {
            localStorage.setItem("preferredLanguage", language);
        } catch (error) {}
    };

    helpers.getStoredLanguagePreference =
        function getStoredLanguagePreference() {
            try {
                return localStorage.getItem("preferredLanguage");
            } catch (error) {
                return null;
            }
        };

    helpers.detectBrowserLanguage = function detectBrowserLanguage() {
        try {
            const browserLang = navigator.language || navigator.userLanguage;
            return browserLang && browserLang.toLowerCase().includes("zh")
                ? "zh"
                : "en";
        } catch (error) {
            return "en";
        }
    };

    helpers.isChinesePage = function isChinesePage() {
        return helpers.getCurrentLanguage() === "zh";
    };

    window.LanguageHelpers = helpers;
})();
