// نظام الإنجازات — عداد تراكمي للجولات الملعوبة + إحصائيات إضافية، متخزن في localStorage
const STORAGE_KEY = 'totalRoundsPlayed';
const UNLOCKED_KEY_PREFIX = 'achievement_unlocked_';
const PRIZE_ID = 'grandPrize';
const STATS_KEYS = {
    currentStreak: 'stats_currentStreak',
    bestStreak: 'stats_bestStreak',
    firstTryWins: 'stats_firstTryWins',
    noHintWins: 'stats_noHintWins',
};
export const ACHIEVEMENT_LEVELS = [
    { id: 'lvl1', title: '5 Rounds', titleAr: '5 جولات', lockedHintAr: 'يفتح عند 5 جولة', check: (s) => s.totalRounds >= 5 },
    { id: 'lvl2', title: '10 Rounds', titleAr: '10 جولات', lockedHintAr: 'يفتح عند 10 جولة', check: (s) => s.totalRounds >= 10 },
    { id: 'lvl3', title: '15 Rounds', titleAr: '15 جولة', lockedHintAr: 'يفتح عند 15 جولة', check: (s) => s.totalRounds >= 15 },
    { id: 'lvl4', title: '20 Rounds', titleAr: '20 جولة', lockedHintAr: 'يفتح عند 20 جولة', check: (s) => s.totalRounds >= 20 },
    { id: 'lvl5', title: '25 Rounds', titleAr: '25 جولة', lockedHintAr: 'يفتح عند 25 جولة', check: (s) => s.totalRounds >= 25 },
    { id: 'lvl6', title: '35 Rounds', titleAr: '35 جولة', lockedHintAr: 'يفتح عند 35 جولة', check: (s) => s.totalRounds >= 35 },
    { id: 'lvl7', title: '50 Rounds', titleAr: '50 جولة', lockedHintAr: 'يفتح عند 50 جولة', check: (s) => s.totalRounds >= 50 },
    { id: 'lvl8', title: '75 Rounds', titleAr: '75 جولة', lockedHintAr: 'يفتح عند 75 جولة', check: (s) => s.totalRounds >= 75 },
    { id: 'lvl9', title: '100 Rounds', titleAr: '100 جولة', lockedHintAr: 'يفتح عند 100 جولة', check: (s) => s.totalRounds >= 100 },
    { id: 'lvl10', title: '150 Rounds', titleAr: '150 جولة', lockedHintAr: 'يفتح عند 150 جولة', check: (s) => s.totalRounds >= 150 },
    // إنجازات أصعب — مربوطة بأسلوب اللعب مش فقط عدد الجولات
    { id: 'lvl11', title: 'Win Streak', titleAr: 'سلسلة فوز 5', lockedHintAr: 'اربح 5 جولات على التوالي', check: (s) => s.bestStreak >= 5 },
    { id: 'lvl12', title: 'Sharp Shooter', titleAr: 'فوز من أول محاولة × 10', lockedHintAr: 'اربح من أول محاولة 10 مرات', check: (s) => s.firstTryWins >= 10 },
    { id: 'lvl13', title: 'No Hints Needed', titleAr: 'فوز بدون هينت × 15', lockedHintAr: 'اربح بدون استخدام هينت 15 مرة', check: (s) => s.noHintWins >= 15 },
];
const GRAND_PRIZE = {
    id: PRIZE_ID,
    title: 'Grand Prize',
    titleAr: 'الجائزة الكبرى',
    lockedHintAr: 'أكمل كل الإنجازات',
    isGrandPrize: true,
    // ماله شرط مستقل، بيفتح لما كل الإنجازات العادية تفتح — يتفحص بشكل منفصل
    check: () => false,
};
function getStats() {
    var _a, _b, _c, _d;
    const raw = localStorage.getItem(STORAGE_KEY);
    const totalRounds = raw ? parseInt(raw, 10) || 0 : 0;
    return {
        totalRounds,
        currentStreak: parseInt((_a = localStorage.getItem(STATS_KEYS.currentStreak)) !== null && _a !== void 0 ? _a : '0', 10) || 0,
        bestStreak: parseInt((_b = localStorage.getItem(STATS_KEYS.bestStreak)) !== null && _b !== void 0 ? _b : '0', 10) || 0,
        firstTryWins: parseInt((_c = localStorage.getItem(STATS_KEYS.firstTryWins)) !== null && _c !== void 0 ? _c : '0', 10) || 0,
        noHintWins: parseInt((_d = localStorage.getItem(STATS_KEYS.noHintWins)) !== null && _d !== void 0 ? _d : '0', 10) || 0,
    };
}
function setStats(stats) {
    localStorage.setItem(STORAGE_KEY, String(stats.totalRounds));
    localStorage.setItem(STATS_KEYS.currentStreak, String(stats.currentStreak));
    localStorage.setItem(STATS_KEYS.bestStreak, String(stats.bestStreak));
    localStorage.setItem(STATS_KEYS.firstTryWins, String(stats.firstTryWins));
    localStorage.setItem(STATS_KEYS.noHintWins, String(stats.noHintWins));
}
function isUnlocked(id) {
    return localStorage.getItem(UNLOCKED_KEY_PREFIX + id) === 'true';
}
function markUnlocked(id) {
    localStorage.setItem(UNLOCKED_KEY_PREFIX + id, 'true');
}
function areAllAchievementsUnlocked() {
    return ACHIEVEMENT_LEVELS.every((level) => isUnlocked(level.id));
}
let onNewUnlock = null;
/**
 * ينده عند نهاية كل جولة (فوز أو خسارة).
 * @param won هل الجولة انتهت بفوز
 * @param triesUsed رقم المحاولة اللي انتهت فيها الجولة (1 = فوز من أول محاولة)
 * @param usedHint هل استخدم هينت في هذي الجولة
 */
export function incrementRoundsPlayed(won, triesUsed, usedHint) {
    const stats = getStats();
    stats.totalRounds += 1;
    if (won) {
        stats.currentStreak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
        if (triesUsed === 1)
            stats.firstTryWins += 1;
        if (!usedHint)
            stats.noHintWins += 1;
    }
    else {
        stats.currentStreak = 0;
    }
    setStats(stats);
    ACHIEVEMENT_LEVELS.forEach((level) => {
        if (!isUnlocked(level.id) && level.check(stats)) {
            markUnlocked(level.id);
            onNewUnlock === null || onNewUnlock === void 0 ? void 0 : onNewUnlock(level);
        }
    });
    // الجائزة تفتح فقط لما كل الإنجازات فوق تكون مفتوحة
    if (!isUnlocked(PRIZE_ID) && areAllAchievementsUnlocked()) {
        markUnlocked(PRIZE_ID);
        onNewUnlock === null || onNewUnlock === void 0 ? void 0 : onNewUnlock(GRAND_PRIZE);
    }
    renderAchievementsModal();
}
let currentFilter = 'unlocked';
const FILTER_BTN_ACTIVE = 'bg-[#f7e012] text-black';
const FILTER_BTN_INACTIVE = 'bg-[#ddd] dark:bg-neutral-700 text-black dark:text-neutral-300';
function renderFilterButtons() {
    const filterIds = ['unlocked', 'locked', 'prize'];
    filterIds.forEach((mode) => {
        const btn = document.getElementById(`filter-${mode}`);
        if (!btn)
            return;
        const isActive = currentFilter === mode;
        btn.className = `px-2 py-2 border-2 border-black border-b-4 font-bold uppercase text-[11px] rounded-sm ${isActive ? FILTER_BTN_ACTIVE : FILTER_BTN_INACTIVE}`;
    });
}
function renderAchievementsModal() {
    const list = document.getElementById('achievements-list');
    const prizePanel = document.getElementById('prize-panel');
    const prizeLockedMsg = document.getElementById('prize-locked-msg');
    const giftContent = document.getElementById('gift-content');
    if (!list || !prizePanel || !prizeLockedMsg || !giftContent)
        return;
    renderFilterButtons();
    const stats = getStats();
    const progressText = document.getElementById('achievements-progress');
    if (progressText) {
        progressText.textContent = `Total rounds played: ${stats.totalRounds}`;
    }
    if (currentFilter === 'prize') {
        list.classList.add('hidden');
        prizePanel.classList.remove('hidden');
        const prizeUnlocked = isUnlocked(PRIZE_ID);
        prizeLockedMsg.classList.toggle('hidden', prizeUnlocked);
        giftContent.classList.toggle('hidden', !prizeUnlocked);
        return;
    }
    prizePanel.classList.add('hidden');
    list.classList.remove('hidden');
    list.innerHTML = '';
    const wantUnlocked = currentFilter === 'unlocked';
    const filteredLevels = ACHIEVEMENT_LEVELS.filter((level) => isUnlocked(level.id) === wantUnlocked);
    if (filteredLevels.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'text-xs font-semibold text-gray-500 dark:text-neutral-400 py-4';
        emptyMsg.dir = 'rtl';
        emptyMsg.textContent = wantUnlocked ? 'ما فتحت أي إنجاز بعد' : 'فتحت كل الإنجازات! 🎉';
        list.appendChild(emptyMsg);
        return;
    }
    filteredLevels.forEach((level) => {
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
        subEl.textContent = unlocked ? level.titleAr : level.lockedHintAr;
        left.appendChild(titleEl);
        left.appendChild(subEl);
        const badge = document.createElement('span');
        badge.className = 'text-2xl';
        badge.textContent = unlocked ? '✅' : '🔒';
        row.appendChild(left);
        row.appendChild(badge);
        list.appendChild(row);
    });
}
function showUnlockPopup(level) {
    const popup = document.getElementById('achievement-unlock-popup');
    const titleEl = document.getElementById('achievement-unlock-title');
    const subEl = document.getElementById('achievement-unlock-sub');
    if (!popup || !titleEl || !subEl)
        return;
    if (level.isGrandPrize) {
        titleEl.textContent = 'لقد أكملت كل الإنجازات';
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
            currentFilter = 'unlocked';
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
    const filterModes = ['unlocked', 'locked', 'prize'];
    filterModes.forEach((mode) => {
        const btn = document.getElementById(`filter-${mode}`);
        btn === null || btn === void 0 ? void 0 : btn.addEventListener('click', () => {
            currentFilter = mode;
            renderAchievementsModal();
        });
    });
}
