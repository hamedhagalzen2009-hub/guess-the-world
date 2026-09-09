
//  * Settings modal behaviour + category filtering (lang / type).
//  * لا يمس منطق اختيار الفئات (getActiveCategories) إطلاقاً — فلترة بصرية فقط.

type LangFilter = 'all' | 'ar' | 'en';
type TypeFilter = 'all' | 'anime' | 'football' | 'general' | 'people';

let currentLang: LangFilter = 'all';
let currentType: TypeFilter = 'all';

function $(id: string) {
  return document.getElementById(id);
}

function getLabels(): HTMLLabelElement[] {
  const box = $('category-checkboxes');
  if (!box) return [];
  return Array.from(box.querySelectorAll<HTMLLabelElement>('label[data-lang]'));
}

function updateCount(): void {
  const visible = visibleCheckboxes();
  const total = visible.length;
  const checked = visible.filter((input) => input.checked).length;
  const el = $('category-count');
  if (el) el.textContent = `${checked} / ${total}`;
}

function applyFilters(): void {
  const labels = getLabels();
  let visible = 0;

  labels.forEach((label) => {
    const lang = label.dataset['lang'] ?? '';
    const type = label.dataset['type'] ?? '';
    const match =
      (currentLang === 'all' || lang === currentLang) &&
      (currentType === 'all' || type === currentType);

    label.classList.toggle('cat-hidden', !match);
    if (match) visible++;
  });

  const empty = $('no-categories-match');
  if (empty) empty.classList.toggle('hidden', visible > 0);

  updateCount();
}

function setActive(container: HTMLElement | null, btn: HTMLElement): void {
  if (!container) return;
  container
    .querySelectorAll<HTMLElement>('.filter-btn')
    .forEach((b) => b.classList.remove('is-active'));
  btn.classList.add('is-active');
}

function visibleCheckboxes(): HTMLInputElement[] {
  return getLabels()
    .filter((l) => !l.classList.contains('cat-hidden'))
    .map((l) => l.querySelector<HTMLInputElement>('.category-checkbox'))
    .filter((i): i is HTMLInputElement => !!i);
}

function setVisible(checked: boolean): void {
  visibleCheckboxes().forEach((input) => {
    if (input.checked !== checked) {
      input.checked = checked;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  updateCount();
}

/* ---------- Modal open/close ---------- */

export function closeSettings(): void {
  $('settings-panel')?.classList.add('hidden');
}

export function openSettings(): void {
  $('settings-panel')?.classList.remove('hidden');
}

export function initSettingsFilter(): void {
  const panel = $('settings-panel');
  if (!panel) return;

  // فلتر اللغة
  const langBox = $('lang-filter');
  langBox?.querySelectorAll<HTMLElement>('[data-lang-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentLang = (btn.dataset['langFilter'] as LangFilter) || 'all';
      setActive(langBox, btn);
      applyFilters();
    });
  });

  // فلتر النوع
  const typeBox = $('type-filter');
  typeBox?.querySelectorAll<HTMLElement>('[data-type-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentType = (btn.dataset['typeFilter'] as TypeFilter) || 'all';
      setActive(typeBox, btn);
      applyFilters();
    });
  });

  // أدوات سريعة
  $('select-all-visible')?.addEventListener('click', () => setVisible(true));
  $('clear-all-visible')?.addEventListener('click', () => setVisible(false));

  // تحديث العدّاد مع أي تغيير
  $('category-checkboxes')?.addEventListener('change', updateCount);

  // إغلاق المودال
  $('settings-close-btn')?.addEventListener('click', closeSettings);
  $('settings-done-btn')?.addEventListener('click', closeSettings);

  // الضغط على الخلفية يقفل
  panel.addEventListener('click', (e) => {
    if (e.target === panel) closeSettings();
  });

  // Escape يقفل
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.classList.contains('hidden')) closeSettings();
  });

  // قفل تمرير الصفحة وقت فتح المودال (يشتغل مع أي كود توجل موجود عندك)
  const observer = new MutationObserver(() => {
    document.body.style.overflow = panel.classList.contains('hidden') ? '' : 'hidden';
  });
  observer.observe(panel, { attributes: true, attributeFilter: ['class'] });

  applyFilters();
}
