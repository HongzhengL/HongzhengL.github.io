(() => {
    const helpers = window.LanguageHelpers || {};

    function getCurrentLanguage() {
        if (helpers.getCurrentLanguage) {
            return helpers.getCurrentLanguage();
        }
        const path = window.location.pathname;
        return path.startsWith("/zh/") || path === "/zh" ? "zh" : "en";
    }

    function getOppositeLanguageUrl(currentPath) {
        if (helpers.getOppositeLanguageUrl) {
            return helpers.getOppositeLanguageUrl(currentPath);
        }
        const path = currentPath || window.location.pathname;
        const isChinese = getCurrentLanguage() === "zh";

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
    }

    function setLanguagePreference(language) {
        if (helpers.setLanguagePreference) {
            helpers.setLanguagePreference(language);
            return;
        }
        try {
            localStorage.setItem("preferredLanguage", language);
        } catch (error) {
            // Ignore failures silently.
        }
    }

    const openDropdowns = new Set();

    function closeDropdown(dropdown) {
        if (!dropdown) {
            return;
        }
        const panel = dropdown.panel;
        if (panel) {
            panel.classList.add("hidden");
        }
        const trigger = dropdown.trigger;
        if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
        }
        openDropdowns.delete(dropdown);
    }

    function closeAllDropdowns(except) {
        [...openDropdowns].forEach((dropdown) => {
            if (dropdown !== except) {
                closeDropdown(dropdown);
            }
        });
    }

    function createDropdown(item, isMobile) {
        const listItem = document.createElement("li");
        listItem.className = isMobile ? "list-none" : "relative list-none";

        const button = document.createElement("button");
        button.type = "button";
        button.className = isMobile
            ? "flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm font-medium text-slate-100 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            : "group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";
        button.innerHTML = `
            <span>${item.text}</span>
            <svg class="h-4 w-4 text-slate-400 transition group-hover:text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
        `;
        button.setAttribute("aria-expanded", "false");

        const panel = document.createElement("div");
        panel.className = isMobile
            ? "mt-2 space-y-1 rounded-2xl border border-white/8 bg-slate-900/80 p-2 shadow-lg"
            : "hidden absolute left-0 top-full mt-3 min-w-[14rem] rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-primary/20 backdrop-blur";

        item.items.forEach((subItem) => {
            const link = document.createElement("a");
            link.className = isMobile
                ? "block rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                : "block rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white";
            link.href = subItem.href;
            link.textContent = subItem.text;
            panel.appendChild(link);
        });

        const dropdownInstance = { trigger: button, panel };

        button.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen = button.getAttribute("aria-expanded") === "true";
            if (isOpen) {
                closeDropdown(dropdownInstance);
            } else {
                closeAllDropdowns(dropdownInstance);
                button.setAttribute("aria-expanded", "true");
                panel.classList.remove("hidden");
                openDropdowns.add(dropdownInstance);
            }
        });

        panel.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        listItem.appendChild(button);
        listItem.appendChild(panel);
        return listItem;
    }

    function createLink(item, isMobile) {
        const listItem = document.createElement("li");
        listItem.className = "list-none";

        const link = document.createElement("a");
        link.href = item.href;
        link.textContent = item.text;
        link.className = isMobile
            ? "block rounded-2xl border border-transparent px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-white/15 hover:bg-white/10 hover:text-white"
            : "inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white";

        listItem.appendChild(link);
        return listItem;
    }

    function createLanguageSwitcherAction(isMobile) {
        const oppositeUrl = getOppositeLanguageUrl(window.location.pathname);
        const isChinese = getCurrentLanguage() === "zh";
        const nextLanguage = isChinese ? "en" : "zh";
        const languageLabel = "EN / 中文";

        const button = document.createElement("a");
        button.href = oppositeUrl;
        button.dataset.languageSwitcher = isMobile ? "mobile" : "desktop";
        button.setAttribute(
            "aria-label",
            isChinese ? "切换至 English 版本" : "Switch to Chinese version",
        );
        button.innerHTML = `
            <span class="inline-flex items-center gap-2">
                <i class="fa-solid fa-earth-asia"></i>
                <span>${languageLabel}</span>
            </span>
        `;

        if (isMobile) {
            button.className =
                "mt-2 inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/20 px-4 py-3 text-sm font-semibold text-primary-100 transition hover:bg-primary/30";
        } else {
            button.className =
                "hidden md:inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-2 text-sm font-semibold text-primary-100 transition hover:bg-primary/25";
        }

        button.addEventListener("click", () => {
            setLanguagePreference(nextLanguage);
        });

        return button;
    }

    function populateMenuItems(menuItems, container, isMobile) {
        if (!container) {
            return;
        }

        container.innerHTML = "";

        menuItems.forEach((item) => {
            if (item.type === "dropdown" && Array.isArray(item.items)) {
                container.appendChild(createDropdown(item, isMobile));
            } else if (item.type === "link") {
                container.appendChild(createLink(item, isMobile));
            }
        });
    }

    function generateMenu(jsonPath) {
        const dataPath = jsonPath || "menus.json";
        fetch(dataPath)
            .then((response) => response.json())
            .then((data) => {
                const desktopMenu = document.getElementById("dynamic-menu");
                const mobileMenu = document.getElementById("dynamic-menu-mobile");

                populateMenuItems(data.menuItems, desktopMenu, false);
                populateMenuItems(data.menuItems, mobileMenu, true);

                const desktopResume = document.querySelector(
                    '[data-resume-link="desktop"]',
                );
                if (
                    desktopResume &&
                    !document.querySelector('[data-language-switcher="desktop"]')
                ) {
                    const desktopSwitcher = createLanguageSwitcherAction(false);
                    desktopResume.insertAdjacentElement(
                        "afterend",
                        desktopSwitcher,
                    );
                }

                const mobileResume = document.querySelector(
                    '[data-resume-link="mobile"]',
                );
                if (
                    mobileResume &&
                    !document.querySelector('[data-language-switcher="mobile"]')
                ) {
                    const mobileSwitcher = createLanguageSwitcherAction(true);
                    mobileResume.insertAdjacentElement(
                        "afterend",
                        mobileSwitcher,
                    );
                }
            })
            .catch((error) => {
                console.error("Unable to load menu:", error);
            });
    }

    function initNavigation() {
        const toggleButton = document.getElementById("nav-toggle");
        const mobileNav = document.getElementById("mobile-nav");

        if (!toggleButton || !mobileNav) {
            return;
        }

        toggleButton.addEventListener("click", () => {
            const isExpanded =
                toggleButton.getAttribute("aria-expanded") === "true";
            toggleButton.setAttribute("aria-expanded", String(!isExpanded));
            mobileNav.classList.toggle("hidden");
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth >= 768) {
                toggleButton.setAttribute("aria-expanded", "false");
                mobileNav.classList.add("hidden");
            }
        });
    }

    document.addEventListener("click", (event) => {
        const target = event.target;
        const dropdownTrigger = target.closest("button[aria-expanded]");
        if (!dropdownTrigger) {
            closeAllDropdowns();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllDropdowns();
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        generateMenu();
        initNavigation();
    });

    window.generateMenu = generateMenu;
})();
