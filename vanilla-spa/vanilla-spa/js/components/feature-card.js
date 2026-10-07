// COMPONENT = UI strukturasi. DATA (icon, title, description) tashqaridan keladi.
// Vue'dagi props'ning asosi: funksiya argumenti.
export function FeatureCard({ icon, title, description }) {
    return `
        <article class="card">
            <span class="card__icon" aria-hidden="true">${icon}</span>
            <h3>${title}</h3>
            <p>${description}</p>
        </article>`;
}
