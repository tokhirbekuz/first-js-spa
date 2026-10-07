import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { FeatureCard } from "../components/feature-card.js";
import { StatCard } from "../components/stat-card.js";

const values = [
    { icon: "🔍", title: "Transparency", description: "No hidden magic. Every step from click to DOM update is visible in the code." },
    { icon: "🎯", title: "Focus",        description: "Only what a learner needs. No virtual DOM, no state engine, no extra layers." },
    { icon: "🌐", title: "Web standards", description: "Built on the History API, ES Modules and the DOM that every browser already ships." },
];

const stats = [
    { value: "100%", label: "Vanilla JS" },
    { value: "0",    label: "Dependencies" },
    { value: "3",    label: "Pages" },
];

export function renderAbout() {
    return `
        ${Navbar()}
        <main id="main" tabindex="-1">
            <section class="hero">
                <div class="container">
                    <h1>About this project</h1>
                    <p class="lead">Vanilla SPA is a small teaching project. It shows how routing, components and data flow work before a framework hides them.</p>
                </div>
            </section>

            <section class="section section--white" aria-labelledby="mission-title">
                <div class="container">
                    <h2 id="mission-title">Mission</h2>
                    <p>Give a learner a working single-page app small enough to understand completely. Once the mechanism is clear, frameworks like Vue or React stop looking like magic.</p>
                </div>
            </section>

            <section class="section" aria-labelledby="values-title">
                <div class="container">
                    <h2 id="values-title">Values</h2>
                    <div class="grid grid--3">
                        ${values.map((value) => FeatureCard(value)).join("")}
                    </div>
                </div>
            </section>

            <section class="section section--white" aria-labelledby="stats-title">
                <div class="container">
                    <h2 id="stats-title">By the numbers</h2>
                    <div class="grid grid--3">
                        ${stats.map((stat) => StatCard(stat)).join("")}
                    </div>
                </div>
            </section>
        </main>
        ${Footer()}`;
}
