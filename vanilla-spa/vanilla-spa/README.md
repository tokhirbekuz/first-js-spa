# Vanilla SPA — frameworksiz Single Page Application

Faqat HTML, CSS va Vanilla JavaScript (ES Modules). Dependency yo'q, build tool yo'q.

## Ishga tushirish

Loyiha papkasida terminal oching. `index.html`ni fayl sifatida (`file://`) ochmang: ES Modules va `/about` kabi yo'llar HTTP server talab qiladi.

```bash
# 1-variant: SPA fallback'li Python server (tavsiya etiladi)
python server.py

# 2-variant: SPA fallback'li Go server
go run server.go

# Faqat tajriba uchun: oddiy static server (fallback YO'Q)
python -m http.server 8000
```

Brauzerda: http://localhost:8000

Tajriba: `python -m http.server` bilan ishga tushirib, Home -> About bosing (ishlaydi),
so'ng sahifani F5 qiling yoki `/about`ni to'g'ridan-to'g'ri oching: **404** chiqadi.
`server.py` yoki `server.go` bilan esa ishlaydi. Sababi pastda (7-savol).

## Fayl strukturasi

```text
vanilla-spa/
├── index.html            # yagona HTML hujjat (shell)
├── server.py             # Python server + SPA fallback
├── server.go             # Go server + SPA fallback
├── css/style.css
└── js/
    ├── app.js            # kirish nuqtasi
    ├── router.js         # routes, router(), navigate(), link/popstate eventlari
    ├── pages/            # katta sahifalar (composition)
    │   ├── home.js  about.js  contact.js  not-found.js
    └── components/       # qayta ishlatiladigan UI bo'laklari
        ├── navbar.js  footer.js  feature-card.js
        ├── stat-card.js  contact-info.js  form-field.js
```

## Qayerdan o'qishni boshlash

1. `index.html` — `<div id="app">` va bitta `<script type="module">`.
2. `js/app.js` — ikki qatorli kirish nuqtasi.
3. `js/router.js` — butun SPA mexanizmi shu yerda.
4. `js/pages/home.js` -> `js/components/feature-card.js` — data -> component -> HTML oqimi.
5. `js/pages/contact.js` — forma, validatsiya, `mount` tushunchasi.

## SPA qanday ishlaydi?

### Oddiy tilda

An'anaviy saytda har bir sahifa alohida HTML fayl: link bossangiz brauzer serverdan yangi sahifa so'raydi va hammasini qayta yuklaydi.

SPA'da server brauzerga **bir marta** `index.html` va JavaScript beradi. Keyin link bosilganda brauzer serverdan yangi sahifa so'ramaydi: JavaScript manzil qatoridagi URL'ni o'zgartiradi va `#app` ichidagi mazmunni almashtiradi. Shuning uchun sayt "sahifalar" orasida reloadsiz, bir zumda o'tadi.

### Professional daraja

```text
Browser
 ↓  GET /index.html (bir marta)
index.html  ->  <script type="module" src="/js/app.js">
 ↓
app.js  ->  initRouter()
 ↓
Router: location.pathname -> routes jadvali
 ↓
History API: pushState (URL o'zgartirish) + popstate (Back/Forward)
 ↓
Page function: renderAbout()   // componentlarni yig'adi
 ↓
Component: Navbar(), StatCard(data) ...   // data -> HTML string
 ↓
DOM: #app.innerHTML = html
```

### Birinchi yuklanish

```text
Browser -> GET / -> index.html -> app.js (module)
 -> initRouter() -> router()
 -> window.location.pathname = "/"
 -> routes["/"] = renderHome
 -> renderHome(): Navbar() + FeatureCard × 3 + Footer() -> HTML string
 -> #app.innerHTML = string
 -> updateActiveLink("/") : aria-current="page"
```

### Home -> About bosilganda

1. **click**: foydalanuvchi `<a href="/about">` ni bosadi.
2. **event listener**: `document`dagi bitta click listener (event delegation) eventni ushlaydi; `event.target.closest("a")` bosilgan linkni topadi. Link ichki ekanligi tekshiriladi (bir xil origin, `target="_blank"` emas, Ctrl/Cmd bosilmagan).
3. **preventDefault()**: brauzerning odatiy harakati (serverdan `/about`ni so'rash) bekor qilinadi.
4. **history.pushState()**: manzil qatori `/about` bo'ladi va history stack'ga yangi yozuv qo'shiladi.
5. **router()**: `pathname` qayta o'qiladi: endi `"/about"`.
6. **route matching**: `routes["/about"]` -> `renderAbout`.
7. **components render**: `renderAbout()` Navbar, FeatureCard × 3, StatCard × 3 va Footer'dan HTML string yig'adi.
8. **DOM update**: `#app.innerHTML = ...` eski sahifani yangisi bilan almashtiradi; keyin `aria-current`, `document.title`, scroll va focus yangilanadi.

## `pushState()` nima qiladi va nima qilmaydi

```javascript
history.pushState({}, "", "/about");
```

**Qiladi:**
- manzil qatoridagi URL'ni `/about` ga o'zgartiradi;
- history stack'ga yangi yozuv qo'shadi (Back tugmasi ishlashi uchun);
- birinchi argument (`{}`) — shu yozuvga biriktiriladigan ixtiyoriy `state` obyekti.

**Qilmaydi:**
- sahifani **render qilmaydi**. DOM o'zgarmaydi;
- serverga **request yubormaydi**;
- `popstate` eventini chaqirmaydi.

Shuning uchun `pushState()`dan keyin `router()`ni o'zimiz chaqiramiz: URL o'zgardi, lekin ekrandagi mazmun o'zgarmadi, buni sahifa chizadigan kod hal qiladi. URL — shunchaki manzil; "qaysi sahifa ko'rinadi" degan qarorni router qabul qiladi.

## `popstate`

Foydalanuvchi Back yoki Forward bosganda brauzer URL'ni o'zi o'zgartiradi (SPA ichida serverga bormaydi) va `window`da `popstate` eventini chaqiradi.

```javascript
window.addEventListener("popstate", () => router());
```

Farqi: `pushState()` — **biz** URL'ni o'zgartiramiz (event chiqmaydi, `router()`ni o'zimiz chaqiramiz). `popstate` — **brauzer** URL'ni o'zgartirdi (event chiqadi, `router()`ni shu event orqali chaqiramiz). Ikkalasi kerak: biri oldinga, biri orqaga/oldinga tugmalari uchun.

## Eng muhim 11 ta savol

1. **Router nima?** URL'ni (`pathname`) qaysi sahifa funksiyasi chizilishi kerakligiga bog'laydigan kod. Bu yerda: `routes` obyekti + `router()` funksiyasi.
2. **Component nima?** Data qabul qilib, HTML qaytaradigan funksiya: `FeatureCard({ title, description })`. Struktura bir joyda, ma'lumot tashqarida, shuning uchun bitta component ko'p marta ishlatiladi.
3. **Page nima?** Ko'plab component'larni va sahifaga xos mazmunni yig'adigan katta funksiya (`renderHome`). Page = composition, component = building block.
4. **`pushState()` nima?** URL va history'ni reloadsiz o'zgartiradi. Render qilmaydi, serverga bormaydi.
5. **`popstate` nima?** Foydalanuvchi Back/Forward bosganda brauzer chiqaradigan event. Unda router'ni qayta chaqirib, URL'ga mos sahifani chizamiz.
6. **`preventDefault()` nima?** Eventning odatiy brauzer harakatini bekor qiladi. Linkda: serverdan yangi sahifa yuklash. Formada: yuborish va reload.
7. **Nega reload bo'lmaydi?** Chunki link bosilganda brauzer navigatsiyasi bekor qilinadi. URL'ni `pushState` o'zgartiradi, ekranni JavaScript `#app`ga yangi HTML qo'yib o'zgartiradi. Hujjat (`index.html`) bir marta yuklanadi va hech qachon almashtirilmaydi, shuning uchun JS holati ham saqlanib qoladi.
8. **`innerHTML` nima qiladi?** Elementning ichki mazmunini berilgan HTML string'ni parse qilib, to'liq almashtiradi. Eski DOM tugunlari (va ularga ulangan listenerlar) o'chadi. Shuning uchun forma listenerlari `mount` funksiyasida har render'dan keyin qayta ulanadi, linklar uchun esa event delegation ishlatilgan. Eslatma: `innerHTML`ga foydalanuvchi kiritgan matnni to'g'ridan-to'g'ri qo'ymang (XSS xavfi); bu loyihada faqat o'z statik ma'lumotlarimiz qo'yiladi, foydalanuvchi xabari esa `textContent` bilan yoziladi.
9. **URL o'zgarganda request ketadimi?** `pushState` bilan o'zgarsa: yo'q. Manzil qatoriga yozib Enter bosilsa, F5 qilinsa yoki tashqaridan link orqali kirilsa: ha, brauzer serverga yangi `GET` yuboradi. Bu — to'liq yangi yuklanish.
10. **To'g'ridan-to'g'ri `/about` ochilganda nima bo'ladi?** Brauzer `GET /about` yuboradi. Serverda `about` degan fayl yo'q, oddiy static server 404 qaytaradi. SPA ishlashi uchun server shu so'rovga `index.html`ni qaytarishi kerak. Keyin `app.js` yuklanadi, `pathname` = `/about`, router About'ni chizadi.
11. **Server fallback nima?** "Fayl topilmasa `index.html`ni qaytar" qoidasi. `server.py`: fayl yo'q va yo'lda kengaytma yo'q bo'lsa `self.path = "/index.html"`. `server.go`: fayl yo'q va `filepath.Ext(path) == ""` bo'lsa `http.ServeFile(w, r, "index.html")`. Kengaytmali yo'q fayllar (`/js/yoq.js`) esa haqiqiy 404 qaytaradi, aks holda brauzer JS o'rniga HTML olib, tushunarsiz xato berardi. Production'da bu qoida nginx (`try_files $uri /index.html;`), Netlify/Vercel rewrites kabi joylarda sozlanadi.

## Data -> Component -> HTML -> DOM

```text
home.js: const features = [ {...}, {...}, {...} ]       <- DATA
            ↓ features.map(f => FeatureCard(f))
feature-card.js: FeatureCard({icon,title,description})   <- COMPONENT (structure)
            ↓ HTML string
router.js: #app.innerHTML = html                          <- DOM
```

Vue bilan taqqoslash: `FeatureCard(argument)` ~ props qabul qiladigan component; backtick ichidagi HTML ~ template; `.map(...).join("")` ~ `v-for`. Farq: bu yerda reactivity yo'q, ma'lumot o'zgarsa sahifani qayta chizishni o'zimiz chaqiramiz.
