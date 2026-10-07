// Dastur kirish nuqtasi. index.html shu faylni <script type="module"> bilan yuklaydi.
import { initRouter } from "./router.js";
import { initNavbarEvents } from "./components/navbar.js";

// Mobil menyu eventlari (bir marta ulanadi).
initNavbarEvents();

// Router: linklarni ushlaydi, popstate'ni tinglaydi va birinchi sahifani chizadi.
initRouter();
