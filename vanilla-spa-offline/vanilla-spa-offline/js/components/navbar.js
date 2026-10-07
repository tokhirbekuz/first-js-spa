// Link ma'lumotlari — komponentdan ALOHIDA turadi.
const links = [
    { href: "#/",        label: "Home" },
    { href: "#/about",   label: "About" },
    { href: "#/contact", label: "Contact" },
];

// aria-current bu yerda yozilmaydi: uni router har navigatsiyada yangilaydi.
function Navbar() {
    const items = links
        .map(({ href, label }) => `
            <li><a class="nav__link" href="${href}">${label}</a></li>`)
        .join("");

    return `
        <header class="site-header">
            <div class="container">
                <nav class="nav" aria-label="Main">
                    <a class="nav__brand" href="#/">Vanilla SPA</a>
                    <button class="nav__toggle" type="button"
                            aria-expanded="false" aria-controls="nav-menu">Menu</button>
                    <ul class="nav__menu" id="nav-menu">${items}
                    </ul>
                </nav>
            </div>
        </header>`;
}

// Mobil menyu: open / close / toggle. Event delegation ishlatilgan,
// chunki Navbar har navigatsiyada qayta yaratiladi.
function initNavbarEvents() {
    const setOpen = (isOpen) => {
        const toggle = document.querySelector(".nav__toggle");
        const menu = document.querySelector(".nav__menu");
        if (!toggle || !menu) return;
        menu.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
    };

    document.addEventListener("click", (event) => {
        const toggle = event.target.closest(".nav__toggle");
        if (toggle) {
            // toggle: hozirgi holatning teskarisi
            setOpen(toggle.getAttribute("aria-expanded") !== "true");
        }
    });

    // Escape bosilsa menyuni yopamiz.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setOpen(false);
    });
}
