// Kirish nuqtasi. Hamma funksiyalar oldingi <script> teglardan global bo'lib kelgan.
initNavbarEvents();
initRouter();

// "Skip to content" link: href="#main" hash-routerni buzmasligi uchun o'zimiz boshqaramiz.
document.addEventListener("click", (event) => {
    if (event.target.closest(".skip-link")) {
        event.preventDefault();
        document.querySelector("main")?.focus();
    }
});
