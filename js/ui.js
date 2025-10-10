(() => {
    function trapFocus(modal) {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input[type="text"]:not([disabled])',
            'input[type="radio"]:not([disabled])',
            'input[type="checkbox"]:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ].join(",");

        const focusableElements = Array.from(
            modal.querySelectorAll(focusableSelectors),
        );

        if (focusableElements.length === 0) {
            return () => {};
        }

        function focusHandler(event) {
            if (event.key !== "Tab") {
                return;
            }

            const { activeElement } = document;
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        modal.addEventListener("keydown", focusHandler);
        return () => modal.removeEventListener("keydown", focusHandler);
    }

    document.addEventListener("DOMContentLoaded", () => {
        const modals = new Map();

        document.querySelectorAll("[data-modal]").forEach((modal) => {
            modals.set(modal.id, modal);
        });

        const activeModals = new Map();

        function openModalById(id) {
            const modal = modals.get(id);
            if (!modal) {
                return;
            }

            modal.classList.remove("hidden");
            modal.classList.add("flex");
            modal.setAttribute("aria-hidden", "false");

            const removeFocusTrap = trapFocus(modal);
            activeModals.set(id, removeFocusTrap);

            const focusTarget =
                modal.querySelector("[data-modal-focus]") ||
                modal.querySelector("[data-modal-close]") ||
                modal.querySelector("button");

            if (focusTarget) {
                focusTarget.focus();
            }
        }

        function closeModalById(id) {
            const modal = modals.get(id);
            if (!modal) {
                return;
            }

            modal.classList.add("hidden");
            modal.classList.remove("flex");
            modal.setAttribute("aria-hidden", "true");

            const releaseFocusTrap = activeModals.get(id);
            if (releaseFocusTrap) {
                releaseFocusTrap();
                activeModals.delete(id);
            }
        }

        document.querySelectorAll("[data-modal-target]").forEach((trigger) => {
            const targetId = trigger.getAttribute("data-modal-target");
            trigger.addEventListener("click", (event) => {
                event.preventDefault();
                openModalById(targetId);
            });
        });

        document.querySelectorAll("[data-modal-close]").forEach((closer) => {
            const targetId = closer.getAttribute("data-modal-close");
            closer.addEventListener("click", (event) => {
                event.preventDefault();
                closeModalById(targetId);
            });
        });

        modals.forEach((modal, id) => {
            modal.addEventListener("click", (event) => {
                if (event.target === modal) {
                    closeModalById(id);
                }
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                activeModals.forEach((_release, id) => closeModalById(id));
            }
        });
    });
})();
