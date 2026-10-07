// Route jadvali: hash ichidagi yo'l ("#/about" -> "/about") -> page funksiyasi.
// Bu fayl classic script: renderHome, renderAbout... boshqa fayllardan global bo'lib keladi.
const routes = {
    "/":        { title: "Home",    render: renderHome },
    "/about":   { title: "About",   render: renderAbout },
    "/contact": { title: "Contact", render: renderContact, mount: mountContact },
};

const notFoundRoute = { title: "Page not found", render: renderNotFound };

// URL'dagi "#/about" dan "/about" ni ajratib olamiz. Hash bo'sh bo'lsa — "/".
function getCurrentPath() {
    let path = window.location.hash.slice(1) || "/";
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    return path;
}

// Navbar'dagi joriy sahifa linkiga aria-current="page" qo'yadi.
function updateActiveLink(path) {
    document.querySelectorAll(".nav__link").forEach((link) => {
        if (link.getAttribute("href") === "#" + path) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

// ASOSIY FUNKSIYA: hozirgi URL'ga qarab mos sahifani chizadi.
function router() {
    const path = getCurrentPath();                          // 1. URL'ni o'qiymiz
    const route = routes[path] || notFoundRoute;            // 2. Route'ni topamiz (yo'q bo'lsa 404)
    const app = document.querySelector("#app");

    app.innerHTML = route.render(path);                     // 3. Page -> HTML string -> DOM
    document.title = `${route.title} | Vanilla SPA`;
    updateActiveLink(path);                                 // 4. aria-current'ni yangilaymiz

    if (route.mount) route.mount();                         // 5. Yangi DOM'ga eventlarni ulaymiz

    window.scrollTo(0, 0);
    document.querySelector("main")?.focus({ preventScroll: true });
}

function initRouter() {
    // <a href="#/about"> bosilganda brauzer reload QILMAYDI: faqat "#" dan keyingi qism
    // o'zgaradi (hash o'zgarishi serverga/faylga request yubormaydi) va `hashchange` chiqadi.
    // Shuning uchun preventDefault() va pushState() bu yerda KERAK EMAS.
    // Back/Forward ham shu eventni chiqaradi, alohida popstate shart emas.
    window.addEventListener("hashchange", router);

    // Birinchi yuklanish: hozirgi URL'ga mos sahifani chizamiz.
    router();
}
