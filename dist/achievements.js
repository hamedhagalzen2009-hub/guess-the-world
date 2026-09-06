// نظام الإنجازات — عداد تراكمي للجولات الملعوبة، متخزن في localStorage
const STORAGE_KEY = 'totalRoundsPlayed';
const UNLOCKED_KEY_PREFIX = 'achievement_unlocked_';
export const ACHIEVEMENT_LEVELS = [
    { id: 'lvl1', threshold: 5, title: '5 Rounds', titleAr: '5 جولات' },
    { id: 'lvl2', threshold: 10, title: '10 Rounds', titleAr: '10 جولات' },
    { id: 'lvl3', threshold: 15, title: '15 Rounds', titleAr: '15 جولة' },
    { id: 'lvl4', threshold: 20, title: 'Grand Prize', titleAr: 'الجائزة الكبرى', isGrandPrize: true },
];
function getTotalRoundsPlayed() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
}
function setTotalRoundsPlayed(value) {
    localStorage.setItem(STORAGE_KEY, String(value));
}
function isUnlocked(id) {
    return localStorage.getItem(UNLOCKED_KEY_PREFIX + id) === 'true';
}
function markUnlocked(id) {
    localStorage.setItem(UNLOCKED_KEY_PREFIX + id, 'true');
}
let onNewUnlock = null;
/** ينده عند نهاية كل جولة (فوز أو خسارة، مش مهم) */
export function incrementRoundsPlayed() {
    const total = getTotalRoundsPlayed() + 1;
    setTotalRoundsPlayed(total);
    ACHIEVEMENT_LEVELS.forEach((level) => {
        if (total >= level.threshold && !isUnlocked(level.id)) {
            markUnlocked(level.id);
            onNewUnlock === null || onNewUnlock === void 0 ? void 0 : onNewUnlock(level);
        }
    });
    renderAchievementsModal();
}
function renderAchievementsModal() {
    const list = document.getElementById('achievements-list');
    if (!list)
        return;
    const total = getTotalRoundsPlayed();
    list.innerHTML = '';
    ACHIEVEMENT_LEVELS.forEach((level) => {
        if (level.isGrandPrize)
            return;
        const unlocked = isUnlocked(level.id);
        const row = document.createElement('div');
        row.className = unlocked
            ? 'flex items-center justify-between gap-3 border-2 border-black border-b-4 bg-[#f7e012] p-3 rounded-sm'
            : 'flex items-center justify-between gap-3 border-2 border-black border-b-4 bg-[#ddd] dark:bg-neutral-700 p-3 rounded-sm opacity-60';
        const left = document.createElement('div');
        left.className = 'text-left';
        const titleEl = document.createElement('p');
        titleEl.className = 'font-bold uppercase text-sm text-black dark:text-neutral-100';
        titleEl.textContent = unlocked ? level.title : '???';
        const subEl = document.createElement('p');
        subEl.className = 'text-xs font-semibold text-black dark:text-neutral-300';
        subEl.dir = 'rtl';
        subEl.textContent = unlocked ? level.titleAr : `يفتح عند ${level.threshold} جولة`;
        left.appendChild(titleEl);
        left.appendChild(subEl);
        const badge = document.createElement('span');
        badge.className = 'text-2xl';
        badge.textContent = unlocked ? (level.isGrandPrize ? '🏆' : '✅') : '🔒';
        row.appendChild(left);
        row.appendChild(badge);
        list.appendChild(row);
    });
    const progressText = document.getElementById('achievements-progress');
    if (progressText) {
        progressText.textContent = `Total rounds played: ${total}`;
    }
    const giftBtn = document.getElementById('gift-btn');
    const giftLocked = ACHIEVEMENT_LEVELS.find((l) => l.isGrandPrize) ? !isUnlocked('lvl4') : true;
    if (giftBtn) {
        giftBtn.textContent = giftLocked ? '🔒 هدية' : '🎁 هدية';
        giftBtn.disabled = giftLocked;
        giftBtn.className = giftLocked
            ? 'w-full px-4 py-3 bg-[#ddd] dark:bg-neutral-700 text-black dark:text-neutral-300 border-2 border-black border-b-4 font-bold uppercase text-sm rounded-sm opacity-60 cursor-not-allowed'
            : 'w-full px-4 py-3 bg-[#f7e012] text-black border-2 border-black border-b-4 font-bold uppercase text-sm rounded-sm cursor-pointer active:border-b-2 active:translate-y-0.5';
    }
}
function showUnlockPopup(level) {
    const popup = document.getElementById('achievement-unlock-popup');
    const titleEl = document.getElementById('achievement-unlock-title');
    const subEl = document.getElementById('achievement-unlock-sub');
    if (!popup || !titleEl || !subEl)
        return;
    if (level.isGrandPrize) {
        titleEl.textContent = 'لقد أكملت الـ 20 جولة';
        subEl.textContent = 'وتم فتح الهدية 🎁';
    }
    else {
        titleEl.textContent = `Achievement Unlocked: ${level.title}`;
        subEl.textContent = level.titleAr;
    }
    popup.classList.remove('hidden');
    popup.classList.add('rs-anim-card');
    setTimeout(() => {
        popup.classList.add('hidden');
        popup.classList.remove('rs-anim-card');
    }, 3500);
}
export function initAchievements() {
    onNewUnlock = showUnlockPopup;
    renderAchievementsModal();
    const openButtons = document.querySelectorAll('.open-achievements-btn');
    const modal = document.getElementById('achievements-modal');
    const closeBtn = document.getElementById('achievements-close');
    openButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            renderAchievementsModal();
            modal === null || modal === void 0 ? void 0 : modal.classList.remove('hidden');
        });
    });
    closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', () => {
        modal === null || modal === void 0 ? void 0 : modal.classList.add('hidden');
    });
    modal === null || modal === void 0 ? void 0 : modal.addEventListener('click', (e) => {
        if (e.target === modal)
            modal.classList.add('hidden');
    });
    const giftBtn = document.getElementById('gift-btn');
    const giftContent = document.getElementById('gift-content');
    giftBtn === null || giftBtn === void 0 ? void 0 : giftBtn.addEventListener('click', () => {
        if (giftBtn.disabled)
            return;
        giftContent === null || giftContent === void 0 ? void 0 : giftContent.classList.toggle('hidden');
    });
}
