function Footer() {
    const year = new Date().getFullYear();
    return `
        <footer class="site-footer">
            <div class="container site-footer__inner">
                <p>&copy; ${year} Vanilla SPA. Built with plain HTML, CSS and JavaScript.</p>
                <p>No frameworks. No dependencies.</p>
            </div>
        </footer>`;
}
