import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";

export function renderNotFound() {
    return `
        ${Navbar()}
        <main id="main" tabindex="-1">
            <section class="hero">
                <div class="container">
                    <h1>Page not found</h1>
                    <p class="lead">There is no page at <code>${location.pathname.replace(/[<>&"]/g, "")}</code>. Check the address or go back to the start.</p>
                    <div class="btn-row">
                        <a class="btn btn--primary" href="/">Go to Home</a>
                    </div>
                </div>
            </section>
        </main>
        ${Footer()}`;
}
