import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { ContactInfo } from "../components/contact-info.js";
import { FormField } from "../components/form-field.js";

const contact = {
    email: "hello@example.com",
    location: "Samarkand, Uzbekistan",
    hours: "Mon–Fri, 09:00–18:00",
};

const fields = [
    { label: "Name",    name: "name",    type: "text",  autocomplete: "name" },
    { label: "Email",   name: "email",   type: "email", autocomplete: "email" },
    { label: "Message", name: "message", multiline: true },
];

export function renderContact() {
    return `
        ${Navbar()}
        <main id="main" tabindex="-1">
            <section class="hero">
                <div class="container">
                    <h1>Contact</h1>
                    <p class="lead">Questions about the project? Send a message. The form is validated in your browser and nothing is sent anywhere.</p>
                </div>
            </section>

            <section class="section section--white">
                <div class="container contact-layout">
                    <div>
                        <h2>Details</h2>
                        ${ContactInfo(contact)}
                    </div>
                    <div>
                        <h2>Send a message</h2>
                        <form class="form" id="contact-form" novalidate>
                            ${fields.map((field) => FormField(field)).join("")}
                            <div><button class="btn btn--primary" type="submit">Send message</button></div>
                            <p class="form-status" id="form-status" role="status"></p>
                        </form>
                    </div>
                </div>
            </section>
        </main>
        ${Footer()}`;
}

// Validatsiya: qiymatlarni oladi, { maydonNomi: xatoMatni } qaytaradi.
function validate({ name, email, message }) {
    const errors = {};
    if (name.trim() === "") {
        errors.name = "Enter your name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
        errors.email = "Enter a valid email address, for example name@example.com.";
    }
    if (message.trim().length < 10) {
        errors.message = "Write at least 10 characters so we understand your message.";
    }
    return errors;
}

// Bitta maydonning xatosini ko'rsatadi yoki tozalaydi.
function setFieldError(form, name, text = "") {
    const input = form.elements[name];
    form.querySelector(`#${name}-error`).textContent = text;
    if (text) {
        input.setAttribute("aria-invalid", "true");
    } else {
        input.removeAttribute("aria-invalid");
    }
}

// Sahifa DOM'ga qo'yilgandan keyin router shu funksiyani chaqiradi.
export function mountContact() {
    const form = document.querySelector("#contact-form");
    const status = document.querySelector("#form-status");

    form.addEventListener("submit", (event) => {
        event.preventDefault();   // brauzerning odatiy yuborishini (reload) to'xtatamiz
        status.textContent = "";

        const values = Object.fromEntries(new FormData(form));
        const errors = validate(values);

        for (const name of ["name", "email", "message"]) {
            setFieldError(form, name, errors[name]);
        }

        const firstInvalid = Object.keys(errors)[0];
        if (firstInvalid) {
            form.elements[firstInvalid].focus();   // klaviatura/screen reader foydalanuvchisi xatoga tushsin
            return;
        }

        // Backend yo'q: faqat muvaffaqiyat xabari.
        form.reset();
        status.textContent = "Message sent successfully.";
    });

    // Foydalanuvchi yozishni boshlasa, shu maydonning xatosini olib tashlaymiz.
    form.addEventListener("input", (event) => {
        if (event.target.name) setFieldError(form, event.target.name);
    });
}
