//  * Settings modal behaviour + category filtering (lang / type).
//  * لا يمس منطق اختيار الفئات (getActiveCategories) إطلاقاً — فلترة بصرية فقط.
let currentLang = 'all';
let currentType = 'all';
function $(id) {
    return document.getElementById(id);
}
function getLabels() {
    const box = $('category-checkboxes');
    if (!box)
        return [];
    return Array.from(box.querySelectorAll('label[data-lang]'));
}
function updateCount() {
    const visible = visibleCheckboxes();
    const total = visible.length;
    const checked = visible.filter((input) => input.checked).length;
    const el = $('category-count');
    if (el)
        el.textContent = `${checked} / ${total}`;
}
function applyFilters() {
    const labels = getLabels();
    let visible = 0;
    labels.forEach((label) => {
        var _a, _b;
        const lang = (_a = label.dataset['lang']) !== null && _a !== void 0 ? _a : '';
        const type = (_b = label.dataset['type']) !== null && _b !== void 0 ? _b : '';
        const match = (currentLang === 'all' || lang === currentLang) &&
            (currentType === 'all' || type === currentType);
        label.classList.toggle('cat-hidden', !match);
        if (match)
            visible++;
    });
    const empty = $('no-categories-match');
    if (empty)
        empty.classList.toggle('hidden', visible > 0);
    updateCount();
}
function setActive(container, btn) {
    if (!container)
        return;
    container
        .querySelectorAll('.filter-btn')
        .forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
}
function visibleCheckboxes() {
    return getLabels()
        .filter((l) => !l.classList.contains('cat-hidden'))
        .map((l) => l.querySelector('.category-checkbox'))
        .filter((i) => !!i);
}
function setVisible(checked) {
    visibleCheckboxes().forEach((input) => {
        if (input.checked !== checked) {
            input.checked = checked;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
    updateCount();
}
/* ---------- Modal open/close ---------- */
export function closeSettings() {
    var _a;
    (_a = $('settings-panel')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
}
export function openSettings() {
    var _a;
    (_a = $('settings-panel')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
}
export function initSettingsFilter() {
    var _a, _b, _c, _d, _e;
    const panel = $('settings-panel');
    if (!panel)
        return;
    // فلتر اللغة
    const langBox = $('lang-filter');
    langBox === null || langBox === void 0 ? void 0 : langBox.querySelectorAll('[data-lang-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentLang = btn.dataset['langFilter'] || 'all';
            setActive(langBox, btn);
            applyFilters();
        });
    });
    // فلتر النوع
    const typeBox = $('type-filter');
    typeBox === null || typeBox === void 0 ? void 0 : typeBox.querySelectorAll('[data-type-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentType = btn.dataset['typeFilter'] || 'all';
            setActive(typeBox, btn);
            applyFilters();
        });
    });
    // أدوات سريعة
    (_a = $('select-all-visible')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => setVisible(true));
    (_b = $('clear-all-visible')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => setVisible(false));
    // تحديث العدّاد مع أي تغيير
    (_c = $('category-checkboxes')) === null || _c === void 0 ? void 0 : _c.addEventListener('change', updateCount);
    // إغلاق المودال
    (_d = $('settings-close-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', closeSettings);
    (_e = $('settings-done-btn')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', closeSettings);
    // الضغط على الخلفية يقفل
    panel.addEventListener('click', (e) => {
        if (e.target === panel)
            closeSettings();
    });
    // Escape يقفل
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !panel.classList.contains('hidden'))
            closeSettings();
    });
    // قفل تمرير الصفحة وقت فتح المودال (يشتغل مع أي كود توجل موجود عندك)
    const observer = new MutationObserver(() => {
        document.body.style.overflow = panel.classList.contains('hidden') ? '' : 'hidden';
    });
    observer.observe(panel, { attributes: true, attributeFilter: ['class'] });
    applyFilters();
}
