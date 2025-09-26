function addBackToTopButton() {
    const button = document.createElement("button");
    button.className = "btn btn-primary position-fixed bottom-0 end-0 m-4";
    button.innerHTML = "↑ Top";
    button.style.display = "none";
    button.style.zIndex = "1000";

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    });

    document.body.appendChild(button);
}

addBackToTopButton();
