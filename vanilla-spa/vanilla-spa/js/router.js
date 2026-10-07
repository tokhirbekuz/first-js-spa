import { renderHome } from "./pages/home.js";
import { renderAbout } from "./pages/about.js";
import { renderContact, mountContact } from "./pages/contact.js";
import { renderNotFound } from "./pages/not-found.js";

// Route jadvali: URL pathname -> qaysi page funksiyasi chaqiriladi.
// `mount` — HTML DOM'ga qo'yilgandan KEYIN ishlaydigan ixtiyoriy funksiya
// (masalan, formaga event listener ulash uchun).
const routes = {
    "/":        { title: "Home",    render: renderHome },
    "/about":   { title: "About",   render: renderAbout },
    "/contact": { title: "Contact", render: renderContact, mount: mountContact },
};

const notFoundRoute = { title: "Page not found", render: renderNotFound };

// "/about/" va "/about" bir xil sahifa bo'lsin.
function normalizePath(pathname) {
    if (pathname.length > 1 && pathname.endsWith("/")) {
        return pathname.slice(0, -1);
    }
    return pathname;
}

// Navbar'dagi joriy sahifa linkiga aria-current="page" qo'yadi.
function updateActiveLink(path) {
    document.querySelectorAll(".nav__link").forEach((link) => {
        if (normalizePath(new URL(link.href).pathname) === path) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

// ASOSIY FUNKSIYA: URL'ga qarab mos sahifani chizadi.
export function router() {
    const path = normalizePath(window.location.pathname);   // 1. URL'ni o'qiymiz
    const route = routes[path] || notFoundRoute;            // 2. Route'ni topamiz (yo'q bo'lsa 404)
    const app = document.querySelector("#app");

    app.innerHTML = route.render();                         // 3. Page -> HTML string -> DOM
    document.title = `${route.title} | Vanilla SPA`;
    updateActiveLink(path);                                 // 4. aria-current'ni yangilaymiz

    if (route.mount) route.mount();                         // 5. Yangi DOM'ga eventlarni ulaymiz

    // Brauzer odatda yangi sahifada tepaga chiqaradi va focus beradi —
    // SPA'da buni o'zimiz qilishimiz kerak (screen reader uchun ham muhim).
    window.scrollTo(0, 0);
    document.querySelector("main")?.focus({ preventScroll: true });
}

// Dasturiy navigatsiya: URL'ni reloadsiz o'zgartirib, sahifani chizadi.
export function navigate(path) {
    if (path === window.location.pathname) return;  // bir xil sahifaga ikki marta history yozmaymiz

    // URLni reloadsiz o'zgartiramiz (faqat manzil qatori + history stack).
    history.pushState({}, "", path);

    // pushState o'zi sahifa chizmaydi — yangi URLga mos page'ni o'zimiz chizamiz.
    router();
}

// Bosilgan link ichki (SPA) linkmi? Shuni aniqlaymiz.
function isInternalNavigation(event, link) {
    if (event.defaultPrevented || event.button !== 0) return false;                       // faqat chap tugma
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;   // yangi tab va h.k.
    if (link.target && link.target !== "_self") return false;                             // target="_blank"
    if (link.hasAttribute("download")) return false;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;                              // tashqi domen

    // Shu sahifa ichidagi #anchor (masalan, skip-link) — brauzerning o'ziga qoldiramiz.
    if (url.pathname === window.location.pathname && url.hash) return false;

    return true;
}

export function initRouter() {
    // Event delegation: bitta listener hamma linklarni ushlaydi,
    // hatto keyin innerHTML bilan yaratilgan linklarni ham.
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (!link || !isInternalNavigation(event, link)) return;

        // Brauzerning odatiy navigatsiyasini (sahifani reload qilishni) to'xtatamiz.
        event.preventDefault();

        navigate(new URL(link.href).pathname);
    });

    // Back/Forward tugmalari: URL o'zgaradi, lekin pushState chaqirilmaydi —
    // shuning uchun shu event orqali sahifani qayta chizamiz.
    window.addEventListener("popstate", () => router());

    // Birinchi yuklanish: hozirgi URL'ga mos sahifani chizamiz.
    router();
}
