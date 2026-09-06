const gameName = 'Gusse The World';
let onBackToMenu = null;
export function initUI(onStartGame, onBack) {
    document.title = gameName;
    const gameHeader = document.querySelector('.game-header');
    if (gameHeader)
        gameHeader.innerHTML = gameName;
    onBackToMenu = onBack !== null && onBack !== void 0 ? onBack : null;
    const run = () => setupUI(onStartGame);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    }
    else {
        run();
    }
}
function setupUI(onStartGame) {
    let gameStarted = false;
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameScreen = document.getElementById('game-screen');
    const developerModal = document.getElementById('developer-modal');
    const howToPlayPanel = document.getElementById('how-to-play-panel');
    const settingsPanel = document.getElementById('settings-panel');
    const btnStart = document.getElementById('btn-start');
    const btnHowToPlay = document.getElementById('btn-how-to-play');
    const btnSettings = document.getElementById('btn-settings');
    const btnDeveloper = document.getElementById('btn-developer');
    const developerClose = document.getElementById('developer-close');
    const gamesPromo = document.getElementById('games-promo-container');
    // تم التعديل هنا: عناصر زرار الرجوع وبوب أب التأكيد
    const backToMenuDesktop = document.getElementById('back-to-menu-desktop');
    const backToMenuMobile = document.getElementById('back-to-menu-mobile');
    const backConfirmModal = document.getElementById('back-confirm-modal');
    const confirmBackBtn = document.getElementById('confirm-back-btn');
    const cancelBackBtn = document.getElementById('cancel-back-btn');
    btnStart === null || btnStart === void 0 ? void 0 : btnStart.addEventListener('click', () => {
        var _a;
        welcomeScreen === null || welcomeScreen === void 0 ? void 0 : welcomeScreen.classList.add('hidden');
        gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.classList.remove('hidden');
        // تم التعديل هنا: تشغيل onStartGame في كل مرة (بما فيها الرجوع من النتائج)
        onStartGame();
        gamesPromo === null || gamesPromo === void 0 ? void 0 : gamesPromo.classList.add('hidden');
        (_a = document.getElementById('theme-toggle')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        gameStarted = true;
    });
    btnHowToPlay === null || btnHowToPlay === void 0 ? void 0 : btnHowToPlay.addEventListener('click', () => {
        howToPlayPanel === null || howToPlayPanel === void 0 ? void 0 : howToPlayPanel.classList.toggle('hidden');
        settingsPanel === null || settingsPanel === void 0 ? void 0 : settingsPanel.classList.add('hidden');
    });
    btnSettings === null || btnSettings === void 0 ? void 0 : btnSettings.addEventListener('click', () => {
        settingsPanel === null || settingsPanel === void 0 ? void 0 : settingsPanel.classList.toggle('hidden');
        howToPlayPanel === null || howToPlayPanel === void 0 ? void 0 : howToPlayPanel.classList.add('hidden');
    });
    btnDeveloper === null || btnDeveloper === void 0 ? void 0 : btnDeveloper.addEventListener('click', () => {
        developerModal === null || developerModal === void 0 ? void 0 : developerModal.classList.remove('hidden');
        gamesPromo === null || gamesPromo === void 0 ? void 0 : gamesPromo.classList.add('hidden');
    });
    developerClose === null || developerClose === void 0 ? void 0 : developerClose.addEventListener('click', () => {
        developerModal === null || developerModal === void 0 ? void 0 : developerModal.classList.add('hidden');
        gamesPromo === null || gamesPromo === void 0 ? void 0 : gamesPromo.classList.remove('hidden');
    });
    developerModal === null || developerModal === void 0 ? void 0 : developerModal.addEventListener('click', (event) => {
        if (event.target === developerModal) {
            developerModal.classList.add('hidden');
            gamesPromo === null || gamesPromo === void 0 ? void 0 : gamesPromo.classList.remove('hidden');
        }
    });
    // تم التعديل هنا: فتح بوب أب التأكيد بدل الرجوع المباشر
    function openBackConfirm() {
        backConfirmModal === null || backConfirmModal === void 0 ? void 0 : backConfirmModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
    backToMenuDesktop === null || backToMenuDesktop === void 0 ? void 0 : backToMenuDesktop.addEventListener('click', openBackConfirm);
    backToMenuMobile === null || backToMenuMobile === void 0 ? void 0 : backToMenuMobile.addEventListener('click', openBackConfirm);
    cancelBackBtn === null || cancelBackBtn === void 0 ? void 0 : cancelBackBtn.addEventListener('click', () => {
        backConfirmModal === null || backConfirmModal === void 0 ? void 0 : backConfirmModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    });
    backConfirmModal === null || backConfirmModal === void 0 ? void 0 : backConfirmModal.addEventListener('click', (event) => {
        if (event.target === backConfirmModal) {
            backConfirmModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    });
    confirmBackBtn === null || confirmBackBtn === void 0 ? void 0 : confirmBackBtn.addEventListener('click', () => {
        var _a;
        backConfirmModal === null || backConfirmModal === void 0 ? void 0 : backConfirmModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.classList.add('hidden');
        welcomeScreen === null || welcomeScreen === void 0 ? void 0 : welcomeScreen.classList.remove('hidden');
        gamesPromo === null || gamesPromo === void 0 ? void 0 : gamesPromo.classList.remove('hidden');
        (_a = document.getElementById('theme-toggle')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        onBackToMenu === null || onBackToMenu === void 0 ? void 0 : onBackToMenu();
    });
}
