function StatCard({ value, label }) {
    return `
        <div class="card stat">
            <span class="stat__value">${value}</span>
            <span class="stat__label">${label}</span>
        </div>`;
}
