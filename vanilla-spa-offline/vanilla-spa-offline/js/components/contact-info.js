// Aloqa ma'lumotlari ro'yxati (dl = description list: "nom — qiymat" juftliklari uchun semantik teg).
function ContactInfo({ email, location, hours }) {
    return `
        <dl class="info-list">
            <div><dt>Email</dt><dd><a href="mailto:${email}">${email}</a></dd></div>
            <div><dt>Location</dt><dd>${location}</dd></div>
            <div><dt>Working hours</dt><dd>${hours}</dd></div>
        </dl>`;
}
