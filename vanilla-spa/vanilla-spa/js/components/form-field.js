// Bitta forma maydoni: label + input (yoki textarea) + xato xabari joyi.
// label `for` va input `id` bog'langan; xato matni aria-describedby orqali inputga ulangan.
export function FormField({ label, name, type = "text", multiline = false, autocomplete = "off" }) {
    const control = multiline
        ? `<textarea id="${name}" name="${name}" rows="5"
                aria-describedby="${name}-error"></textarea>`
        : `<input id="${name}" name="${name}" type="${type}" autocomplete="${autocomplete}"
                aria-describedby="${name}-error">`;

    return `
        <div class="field">
            <label for="${name}">${label}</label>
            ${control}
            <p class="field__error" id="${name}-error"></p>
        </div>`;
}
