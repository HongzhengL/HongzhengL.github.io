(() => {
    const helpers = {};

    helpers.getCurrentLanguage = function getCurrentLanguage() {
        const langAttr = document.documentElement.lang || "";
        if (langAttr.toLowerCase().startsWith("zh")) {
            return "zh";
        }

        const path = window.location.pathname;
        return path.startsWith("/zh/") || path === "/zh" ? "zh" : "en";
    };

    helpers.getOppositeLanguage = function getOppositeLanguage() {
        return helpers.getCurrentLanguage() === "zh" ? "en" : "zh";
    };

    helpers.getOppositeLanguageUrl = function getOppositeLanguageUrl(
        currentPath,
    ) {
        const path = currentPath || window.location.pathname;
        const isChinese = helpers.getCurrentLanguage() === "zh";

        if (!isChinese) {
            if (path === "/" || path.endsWith("/index.html")) {
                return "/zh/index.html";
            }
            if (path.endsWith("/course-review.html")) {
                return "/zh/course-review.html";
            }
            if (path.endsWith("/my-work.html")) {
                return "/zh/my-work.html";
            }
            return "/zh/index.html";
        }

        if (path === "/zh" || path.endsWith("/zh/") || path.endsWith("/zh/index.html")) {
            return "/index.html";
        }
        if (path.endsWith("/zh/course-review.html")) {
            return "/course-review.html";
        }
        if (path.endsWith("/zh/my-work.html")) {
            return "/my-work.html";
        }
        return "/index.html";
    };

    helpers.setLanguagePreference = function setLanguagePreference(language) {
        try {
            localStorage.setItem("preferredLanguage", language);
        } catch (error) {
            // Ignore storage failures (private mode, disabled storage, etc.)
        }
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
