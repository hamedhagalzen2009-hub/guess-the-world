// src/leaderboardBar.ts
// Renders the transparent strip between the bell (left) and theme toggle (right),
// with loading / error states, plus the sign up / log in modal logic.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { signUp, logIn, logOut, signInWithGoogle, onAuthChange, getCurrentUser } from './firebaseAuth.js';
import { loadLeaderboard, loadTopByAchievements, getMyStats } from './leaderboard.js';
import { applyCloudProgress, resetLocalProgress, getStats, getUnlockedIds } from './achievements.js';
function el(id) {
    return document.getElementById(id);
}
function renderLoading() {
    const list = el('leaderboard-list');
    if (!list)
        return;
    list.innerHTML = `
    <div class="flex gap-2">
      <div class="h-4 w-16 rounded-sm bg-black/10 dark:bg-white/10 animate-pulse"></div>
    </div>`;
}
function renderError() {
    var _a;
    const list = el('leaderboard-list');
    if (!list)
        return;
    list.innerHTML = `
    <div class="flex items-center gap-2 text-xs font-bold">
      <span dir="rtl">تعذر تحميل المتصدرين</span>
      <button id="leaderboard-retry" type="button" class="underline">إعادة المحاولة</button>
    </div>`;
    (_a = el('leaderboard-retry')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', refreshLeaderboard);
}
function renderEntries(entries) {
    const list = el('leaderboard-list');
    if (!list)
        return;
    if (entries.length === 0) {
        list.innerHTML = `<span class="text-xs font-bold" dir="rtl">لسه مفيش نتايج</span>`;
        return;
    }
    list.innerHTML = entries
        .slice(0, 1)
        .map((e) => `<span class="text-xs font-bold whitespace-nowrap">#1 ${e.username} · ${e.totalRounds}</span>`)
        .join('');
}
export function refreshLeaderboard() {
    return __awaiter(this, void 0, void 0, function* () {
        renderLoading();
        try {
            const entries = yield loadLeaderboard(1);
            renderEntries(entries);
        }
        catch (e) {
            console.error('[leaderboard] loadLeaderboard failed:', e);
            renderError();
        }
    });
}
function updateAuthButton(username) {
    const authBtn = el('leaderboard-auth-btn');
    const menuBtn = el('leaderboard-menu-btn');
    const list = el('leaderboard-list');
    if (!authBtn || !menuBtn)
        return;
    const loggedIn = !!username;
    authBtn.classList.toggle('hidden', loggedIn);
    menuBtn.classList.toggle('hidden', !loggedIn);
    // logged in: only the (now bigger) "leaderboard list" button shows, no entries beside it.
    // logged out: keep just the #1 entry next to the login button.
    list === null || list === void 0 ? void 0 : list.classList.toggle('hidden', loggedIn);
}
export function setLeaderboardControlsVisible(visible) {
    const strip = el('leaderboard-strip');
    if (strip)
        strip.style.display = visible ? '' : 'none';
}
function wireModal() {
    const modal = el('auth-modal');
    const openBtn = el('leaderboard-auth-btn');
    const closeBtn = el('auth-modal-close');
    const googleBtn = el('auth-google-btn');
    const submitBtn = el('auth-submit-btn');
    const toggleModeBtn = el('auth-toggle-mode');
    const usernameInput = el('auth-username');
    const passwordInput = el('auth-password');
    const errorEl = el('auth-error');
    let mode = 'login';
    function setMode(next) {
        mode = next;
        if (submitBtn)
            submitBtn.textContent = mode === 'signup' ? 'إنشاء حساب' : 'دخول';
        if (toggleModeBtn) {
            toggleModeBtn.textContent = mode === 'signup'
                ? 'عندك حساب؟ سجّل دخول'
                : 'مفيش حساب؟ اعمل واحد';
        }
        if (errorEl)
            errorEl.textContent = '';
    }
    openBtn === null || openBtn === void 0 ? void 0 : openBtn.addEventListener('click', () => {
        setMode('login');
        modal === null || modal === void 0 ? void 0 : modal.classList.remove('hidden');
    });
    closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', () => modal === null || modal === void 0 ? void 0 : modal.classList.add('hidden'));
    toggleModeBtn === null || toggleModeBtn === void 0 ? void 0 : toggleModeBtn.addEventListener('click', () => setMode(mode === 'signup' ? 'login' : 'signup'));
    // ← جديد: زرار جوجل
    googleBtn === null || googleBtn === void 0 ? void 0 : googleBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        if (errorEl)
            errorEl.textContent = '';
        googleBtn.setAttribute('disabled', 'true');
        const result = yield signInWithGoogle();
        googleBtn.removeAttribute('disabled');
        if (!result.ok) {
            if (errorEl)
                errorEl.textContent = result.message;
            return;
        }
        modal === null || modal === void 0 ? void 0 : modal.classList.add('hidden');
    }));
    submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const username = (_a = usernameInput === null || usernameInput === void 0 ? void 0 : usernameInput.value) !== null && _a !== void 0 ? _a : '';
        const password = (_b = passwordInput === null || passwordInput === void 0 ? void 0 : passwordInput.value) !== null && _b !== void 0 ? _b : '';
        if (!username.trim() || password.length < 6) {
            if (errorEl)
                errorEl.textContent = 'اكتب يوزر نيم وباسورد 6 حروف على الأقل.';
            return;
        }
        if (submitBtn)
            submitBtn.setAttribute('disabled', 'true');
        const result = mode === 'signup' ? yield signUp(username, password) : yield logIn(username, password);
        if (submitBtn)
            submitBtn.removeAttribute('disabled');
        if (!result.ok) {
            if (errorEl)
                errorEl.textContent = result.message;
            return;
        }
        modal === null || modal === void 0 ? void 0 : modal.classList.add('hidden');
        if (usernameInput)
            usernameInput.value = '';
        if (passwordInput)
            passwordInput.value = '';
    }));
}
// Custom rank badges — a distinct shape + color per rank (no digits, no literal
// animal icons). Sized to sit inline with the username on the card's left side.
const RANK_BADGE_SVGS = {
    1: `<svg viewBox="0 0 40 40" class="w-9 h-9 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,3 24.7,14.5 37,15.3 27.5,23.2 30.7,35 20,28 9.3,35 12.5,23.2 3,15.3 15.3,14.5"
          fill="#f7e012" stroke="black" stroke-width="2" stroke-linejoin="round"/>
      </svg> <span class="sr-only">#1</span>`,
    2: `<svg viewBox="0 0 40 40" class="w-9 h-9 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,2 35,20 20,38 5,20" fill="#d7dbdf" stroke="black" stroke-width="2" stroke-linejoin="round"/>
      </svg> <span class="sr-only">#2</span>`,
    3: `<svg viewBox="0 0 40 40" class="w-9 h-9 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,3 28,3 37,20 28,37 12,37 3,20" fill="#cf9059" stroke="black" stroke-width="2" stroke-linejoin="round"/>
      </svg> <span class="sr-only">#3</span>`,
    4: `<svg viewBox="0 0 40 40" class="w-9 h-9 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,2 36,14 30,36 10,36 4,14" fill="#8fc1ec" stroke="black" stroke-width="2" stroke-linejoin="round"/>
      </svg> <span class="sr-only">#4</span>`,
    5: `<svg viewBox="0 0 40 40" class="w-9 h-9 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="17" fill="#a3ddc0" stroke="black" stroke-width="2"/>
        <circle cx="20" cy="20" r="8" fill="none" stroke="black" stroke-width="2"/>
      </svg> <span class="sr-only">#5</span>`,
};
function getRankBadgeSVG(rank) {
    var _a;
    return (_a = RANK_BADGE_SVGS[rank]) !== null && _a !== void 0 ? _a : RANK_BADGE_SVGS[5];
}
function renderTop5List(entries, myUid) {
    const list = el('top5-list');
    if (!list)
        return;
    list.innerHTML = '';
    if (entries.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-xs font-semibold text-gray-500 dark:text-neutral-400 py-2';
        empty.dir = 'rtl';
        empty.textContent = 'لسه مفيش نتايج';
        list.appendChild(empty);
        return;
    }
    entries.forEach((entry, i) => {
        var _a;
        const isMe = !!myUid && entry.uid === myUid;
        const rank = i + 1;
        // dir="ltr" here on purpose: badge+username should read left-to-right
        // (logo, then name) regardless of the modal's overall RTL layout.
        const row = document.createElement('div');
        row.dir = 'ltr';
        row.className = `flex items-center justify-between gap-3 border-2 ${isMe ? 'border-[#f7e012]' : 'border-black/60 dark:border-white/20'} border-b-4 bg-white/10 dark:bg-white/5 backdrop-blur-md supports-[backdrop-filter]:bg-white/10 p-3 rounded-sm`;
        // Left side: rank badge + username
        const left = document.createElement('div');
        left.className = 'flex items-center gap-2.5 min-w-0';
        const badge = document.createElement('div');
        badge.innerHTML = getRankBadgeSVG(rank);
        const nameEl = document.createElement('p');
        nameEl.className = 'font-bold text-sm text-black dark:text-neutral-100 truncate';
        nameEl.textContent = `${entry.username}${isMe ? ' (انت)' : ''}`;
        left.appendChild(badge);
        left.appendChild(nameEl);
        // Right side: rounds + prizes
        const right = document.createElement('div');
        right.className = 'flex flex-col items-end gap-0.5 shrink-0';
        const roundsEl = document.createElement('span');
        roundsEl.className = 'text-xs font-semibold text-black/70 dark:text-neutral-300 whitespace-nowrap';
        roundsEl.textContent = `${entry.totalRounds} راوند`;
        const prizeEl = document.createElement('span');
        prizeEl.className = 'text-xs font-bold text-black dark:text-neutral-100 whitespace-nowrap';
        prizeEl.textContent = `🎁 ${(_a = entry.unlockedCount) !== null && _a !== void 0 ? _a : entry.unlockedIds.length}`;
        right.appendChild(roundsEl);
        right.appendChild(prizeEl);
        row.appendChild(left);
        row.appendChild(right);
        list.appendChild(row);
    });
}
function openTop5Modal() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const modal = el('top5-modal');
        const usernameEl = el('top5-me-username');
        const roundsEl = el('top5-me-rounds');
        const prizesEl = el('top5-me-prizes');
        const rankNoteEl = el('top5-me-rank-note');
        if (!modal)
            return;
        const user = getCurrentUser();
        const stats = getStats();
        const myUnlockedCount = getUnlockedIds().length;
        if (usernameEl)
            usernameEl.textContent = (_a = user === null || user === void 0 ? void 0 : user.displayName) !== null && _a !== void 0 ? _a : 'Player';
        if (roundsEl)
            roundsEl.textContent = `الراوندات: ${stats.totalRounds}`;
        if (prizesEl)
            prizesEl.textContent = `🎁 الجوائز: ${myUnlockedCount}`;
        if (rankNoteEl)
            rankNoteEl.textContent = '';
        modal.classList.remove('hidden');
        const list = el('top5-list');
        if (list) {
            list.innerHTML = `<div class="flex gap-2 justify-center py-4">
      ${[0, 1, 2].map(() => `<div class="h-4 w-14 rounded-sm bg-black/10 dark:bg-white/10 animate-pulse"></div>`).join('')}
    </div>`;
        }
        try {
            const entries = yield loadTopByAchievements(5);
            renderTop5List(entries, (_b = user === null || user === void 0 ? void 0 : user.uid) !== null && _b !== void 0 ? _b : null);
            if (rankNoteEl) {
                const inTop5 = !!user && entries.some((e) => e.uid === user.uid);
                rankNoteEl.textContent = inTop5 ? 'انت مصنف في التوب 5 🎉' : 'لسه مش داخل التوب 5';
            }
        }
        catch (e) {
            console.error('[leaderboard] loadTopByAchievements failed:', e);
            if (list) {
                list.innerHTML = `<span class="text-xs font-bold" dir="rtl">تعذر تحميل التصنيف</span>`;
            }
        }
    });
}
function wireTop5Modal() {
    const menuBtn = el('leaderboard-menu-btn');
    const modal = el('top5-modal');
    const closeBtn = el('top5-close-btn');
    const logoutBtn = el('top5-logout-btn');
    menuBtn === null || menuBtn === void 0 ? void 0 : menuBtn.addEventListener('click', () => {
        openTop5Modal();
    });
    closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', () => modal === null || modal === void 0 ? void 0 : modal.classList.add('hidden'));
    modal === null || modal === void 0 ? void 0 : modal.addEventListener('click', (e) => {
        if (e.target === modal)
            modal.classList.add('hidden');
    });
    logoutBtn === null || logoutBtn === void 0 ? void 0 : logoutBtn.addEventListener('click', () => {
        var _a;
        (_a = el('logout-confirm-modal')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
    });
}
function wireLogoutConfirm() {
    const confirmModal = el('logout-confirm-modal');
    const yesBtn = el('logout-confirm-yes-btn');
    const cancelBtn = el('logout-confirm-cancel-btn');
    yesBtn === null || yesBtn === void 0 ? void 0 : yesBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        confirmModal === null || confirmModal === void 0 ? void 0 : confirmModal.classList.add('hidden');
        (_a = el('top5-modal')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        yield logOut();
    }));
    cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', () => {
        confirmModal === null || confirmModal === void 0 ? void 0 : confirmModal.classList.add('hidden');
    });
    confirmModal === null || confirmModal === void 0 ? void 0 : confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal)
            confirmModal.classList.add('hidden');
    });
}
export function initLeaderboardBar() {
    wireModal();
    wireTop5Modal();
    wireLogoutConfirm();
    onAuthChange((user) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        updateAuthButton((_a = user === null || user === void 0 ? void 0 : user.displayName) !== null && _a !== void 0 ? _a : null);
        if (!user) {
            // خرج أو لسه ملوش جلسة: نفضّي التقدم المحلي عشان محدش يفضل عالق من حساب سابق
            resetLocalProgress();
            return;
        }
        // سجّل دخول (سواء من زرار الدخول أو جلسة محفوظة من قبل): نجيب تقدمه الحقيقي
        // من Firestore ونحل محل أي حاجة محلية قديمة — كده بيشتغل من أي جهاز/متصفح.
        const cloud = yield getMyStats();
        if (cloud) {
            applyCloudProgress(cloud, (_b = cloud.unlockedIds) !== null && _b !== void 0 ? _b : []);
        }
        else {
            // حساب جديد لسه معندوش بيانات في Firestore
            resetLocalProgress();
        }
    }));
    refreshLeaderboard();
}
