
// DATA: sahifa ma'lumotlari. Yangi card kerak bo'lsa — shu yerga bitta obyekt qo'shamiz.
const features = [
    { icon: "⚡", title: "Fast",     description: "Pages swap in the browser without a reload, so navigation feels instant." },
    { icon: "🧩", title: "Simple",   description: "A router, a few functions and the History API. You can read all of it in one sitting." },
    { icon: "♻️", title: "Reusable", description: "One FeatureCard component renders every card on this page from plain data." },
];

// PAGE = componentlarni yig'ish (composition).
function renderHome() {
    return `
        ${Navbar()}
        <main id="main" tabindex="-1">
            <section class="hero">
                <div class="container">
                    <h1>Learn how a single-page app really works</h1>
                    <p class="lead">This project uses no framework and no build step. Every mechanism, from routing to components, is plain JavaScript you can open and read.</p>
                    <div class="btn-row">
                        <a class="btn btn--primary" href="#/contact">Get in touch</a>
                        <a class="btn btn--secondary" href="#/about">About the project</a>
                    </div>
                </div>
            </section>

            <section class="section section--white" aria-labelledby="features-title">
                <div class="container">
                    <h2 id="features-title">What you will see</h2>
                    <div class="grid grid--3">
                        ${features.map((feature) => FeatureCard(feature)).join("")}
                    </div>
                </div>
            </section>

            <section class="section" aria-labelledby="cta-title">
                <div class="container">
                    <div class="cta">
                        <h2 id="cta-title">Open the code and follow a click</h2>
                        <p>Click a link, then read router.js to see each step the browser takes.</p>
                        <a class="btn btn--primary" href="#/about">Read how it works</a>
                    </div>
                </div>
            </section>
        </main>
        ${Footer()}`;
}
