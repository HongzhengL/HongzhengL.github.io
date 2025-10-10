function addBackToTopButton() {
    const button = document.createElement("button");
    button.className =
        "fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full border border-primary/40 bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";
    button.innerHTML = `
        <span>Top</span>
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 3a.75.75 0 01.53.22l5 5a.75.75 0 11-1.06 1.06L10.75 5.56v10.19a.75.75 0 11-1.5 0V5.56L5.53 9.28A.75.75 0 114.47 8.22l5-5A.75.75 0 0110 3z" clip-rule="evenodd" />
        </svg>
    `;

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 280) {
            button.classList.remove("hidden");
            button.classList.add("flex");
        } else {
            button.classList.add("hidden");
            button.classList.remove("flex");
        }
    });

    document.body.appendChild(button);
}

document.addEventListener("DOMContentLoaded", addBackToTopButton);
