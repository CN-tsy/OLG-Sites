console.log('Learn-en/cscript_Hamburger.js v=0.1');
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger input");
    const menu = document.querySelector(".menu");
    const overlay = document.querySelector(".overlay");

    hamburger.addEventListener("change", () => {
        if (hamburger.checked) {
            menu.classList.add("active");
            overlay.classList.add("active");
        } else {
            menu.classList.remove("active");
            overlay.classList.remove("active");
        }
    });

    overlay.addEventListener("click", () => {
        hamburger.checked = false;
        menu.classList.remove("active");
        overlay.classList.remove("active");
    });
});

