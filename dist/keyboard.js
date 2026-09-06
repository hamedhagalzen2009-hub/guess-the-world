// Virtual on-screen keyboard (mobile only).
// Parallel input path: it fills the same inputs and calls the same logic as
// physical typing, without touching any listener in main.ts.
const ARABIC_RE = /[\u0600-\u06FF]/;
const QWERTY_ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];
const ARABIC_ROWS = [
    ['ج', 'ح', 'خ', 'ه', 'ع', 'غ', 'ف', 'ق', 'ث', 'ص', 'ض'],
    ['ط', 'ك', 'م', 'ن', 'ت', 'ا', 'ل', 'ب', 'ي', 'س', 'ش'],
    ['د', 'ظ', 'ز', 'و', 'ة', 'ى', 'ر', 'ؤ', 'ء', 'ذ'],
];
const KEY_BASE = 'vk-key flex items-center justify-center flex-1 h-13 rounded-sm border-2 border-black border-b-4 ' +
    'bg-[#eee] dark:bg-neutral-800 text-black dark:text-neutral-100 font-bold uppercase text-base leading-none';
const DEL_BASE = 'vk-key flex items-center justify-center h-13 rounded-sm border-2 border-black border-b-4 ' +
    'bg-[#333] dark:bg-neutral-700 text-[#eee] dark:text-white font-bold uppercase text-xs leading-none';
let container = null;
let currentLang = null;
const letterStatus = {};
/* ---------- input helpers ---------- */
function activeRow() {
    const rows = document.querySelectorAll('.inputs > div');
    for (const row of Array.from(rows)) {
        if (!row.classList.contains('disabled'))
            return row;
    }
    return null;
}
function rowInputs() {
    const row = activeRow();
    if (!row)
        return [];
    return Array.from(row.querySelectorAll('input'));
}
function focusedIndex(inputs) {
    const el = document.activeElement;
    return el ? inputs.indexOf(el) : -1;
}
function typeLetter(letter) {
    const inputs = rowInputs();
    if (inputs.length === 0)
        return;
    let index = focusedIndex(inputs);
    if (index === -1) {
        index = inputs.findIndex((inp) => inp.value === '');
        if (index === -1)
            index = inputs.length - 1;
    }
    const target = inputs[index];
    if (!target || target.disabled)
        return;
    target.value = letter.toUpperCase();
    const next = inputs[index + 1];
    if (next)
        next.focus();
    else
        target.focus();
}
function pressBackspace() {
    const inputs = rowInputs();
    if (inputs.length === 0)
        return;
    let index = focusedIndex(inputs);
    if (index === -1) {
        const firstEmpty = inputs.findIndex((inp) => inp.value === '');
        index = firstEmpty === -1 ? inputs.length - 1 : Math.max(0, firstEmpty);
    }
    const current = inputs[index];
    if (!current)
        return;
    if (current.value !== '') {
        current.value = '';
        current.focus();
    }
    else if (index > 0) {
        const prev = inputs[index - 1];
        if (prev) {
            prev.value = '';
            prev.focus();
        }
    }
}
/* ---------- rendering ---------- */
function makeKey(label, onClick, cls, letterKey) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = cls;
    btn.textContent = label;
    if (letterKey)
        btn.dataset.key = letterKey;
    btn.addEventListener('mousedown', (e) => e.preventDefault());
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        onClick();
    });
    return btn;
}
function render(lang) {
    if (!container)
        return;
    currentLang = lang;
    container.innerHTML = '';
    container.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    const rows = lang === 'ar' ? ARABIC_ROWS : QWERTY_ROWS;
    const maxLen = Math.max(...rows.map((r) => r.length));
    rows.forEach((row, rowIndex) => {
        const rowEl = document.createElement('div');
        rowEl.className = 'flex gap-1 px-0.5';
        // Center shorter rows by adding proportional side spacers (Wordle-style)
        const missing = maxLen - row.length;
        const sidePad = missing / 2;
        if (sidePad > 0) {
            const spacerLeft = document.createElement('div');
            spacerLeft.style.flex = `${sidePad} 1 0`;
            rowEl.appendChild(spacerLeft);
        }
        row.forEach((letter) => {
            const key = makeKey(letter, () => typeLetter(letter), KEY_BASE, letter);
            key.style.flex = '1.15 1 0';
            rowEl.appendChild(key);
        });
        if (sidePad > 0) {
            const spacerRight = document.createElement('div');
            spacerRight.style.flex = `${sidePad} 1 0`;
            rowEl.appendChild(spacerRight);
        }
        // Put the Backspace key at the end of the LAST row only (no Enter key)
        if (rowIndex === rows.length - 1) {
            const del = makeKey('⌫', pressBackspace, DEL_BASE);
            del.style.flex = `${Math.max(1.6, maxLen * 0.16)} 1 0`;
            rowEl.appendChild(del);
        }
        container.appendChild(rowEl);
    });
    applyColors();
}
function applyColors() {
    if (!container)
        return;
    container.querySelectorAll('[data-key]').forEach((btn) => {
        var _a;
        const status = letterStatus[(_a = btn.dataset.key) !== null && _a !== void 0 ? _a : ''];
        if (status) {
            btn.className = `${KEY_BASE} text-white bg-${status}`;
        }
        else {
            btn.className = KEY_BASE;
        }
    });
}
/* ---------- public API ---------- */
export function initKeyboard(_handlers) {
    container = document.getElementById('virtual-keyboard');
    if (container && !currentLang)
        render('en');
}
/** Pick the layout automatically from the current word (Arabic letters -> Arabic layout). */
export function setKeyboardForWord(word) {
    if (!container)
        container = document.getElementById('virtual-keyboard');
    const lang = ARABIC_RE.test(word) ? 'ar' : 'en';
    if (lang !== currentLang)
        render(lang);
}
/** Merge the statuses computed by handelCheck(), keeping the best per letter. */
export function updateKeyboardColors(results) {
    const rank = { lose: 1, mud: 2, win: 3 };
    results.forEach(({ letter, status }) => {
        var _a, _b;
        if (!letter || !status)
            return;
        const key = letter.toLowerCase();
        const prev = letterStatus[key];
        if (!prev || ((_a = rank[status]) !== null && _a !== void 0 ? _a : 0) > ((_b = rank[prev]) !== null && _b !== void 0 ? _b : 0)) {
            letterStatus[key] = status;
        }
    });
    applyColors();
}
/** Clear cumulative key colors (call at the start of every round). */
export function resetKeyboardColors() {
    Object.keys(letterStatus).forEach((k) => delete letterStatus[k]);
    applyColors();
}
