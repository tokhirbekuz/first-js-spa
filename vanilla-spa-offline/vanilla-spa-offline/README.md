# Vanilla SPA — offline versiya (index.html'ni ikki marta bosib oching)

`index.html` ni brauzerda to'g'ridan-to'g'ri (`file://`) oching. Server kerak emas.

## Birinchi versiyadan farqlari (va sabablari)

| Birinchi versiya (server bilan) | Bu versiya (file://) | Sabab |
|---|---|---|
| `<script type="module">`, `import/export` | oddiy `<script>` teglar, global funksiyalar | Brauzer `file://` da ES Modules'ni CORS tufayli bloklaydi |
| `/css/style.css`, `/js/app.js` | `css/style.css`, `js/app.js` | `/` fayl tizimi ildiziga olib boradi |
| `/about` + `history.pushState()` | `#/about` (hash) | `file://` da `pushState` boshqa yo'lga SecurityError beradi; hash esa har doim ishlaydi |
| `popstate` + click'da `preventDefault()` | `hashchange` | Hash o'zgarishi o'zi reload qilmaydi; Back/Forward ham `hashchange` chiqaradi |
| Server fallback kerak | Kerak emas | `#` dan keyingi qism hech qachon serverga/faylga ketmaydi |

Qolgan hamma narsa bir xil: `router()`, route jadvali, page → component → HTML → `#app.innerHTML`, `aria-current`, forma validatsiyasi, mobil menyu.

## Script tartibi muhim

`index.html` oxiridagi `<script>` lar tartibda yuklanadi: avval componentlar, keyin pagelar, keyin `router.js` va `app.js`. Modul tizimi yo'q, shuning uchun funksiya ishlatilishidan oldin e'lon qilingan bo'lishi kerak.

## Click'dan sahifagacha

```text
click <a href="#/about">
 ↓ brauzer faqat "#/about" qismini o'zgartiradi (reload yo'q, request yo'q)
hashchange eventi
 ↓
router(): location.hash -> "/about" -> routes["/about"] -> renderAbout()
 ↓
#app.innerHTML = ...
```
