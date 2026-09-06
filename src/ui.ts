const gameName = 'Gusse The World';

let onBackToMenu: (() => void) | null = null;

export function initUI(onStartGame: () => void, onBack?: () => void): void {
    document.title = gameName;

    const gameHeader = document.querySelector('.game-header');
    if (gameHeader) gameHeader.innerHTML = gameName;

    onBackToMenu = onBack ?? null;

    const run = () => setupUI(onStartGame);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
}

function setupUI(onStartGame: () => void): void {
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

    btnStart?.addEventListener('click', () => {
        welcomeScreen?.classList.add('hidden');
        gameScreen?.classList.remove('hidden');

        // تم التعديل هنا: تشغيل onStartGame في كل مرة (بما فيها الرجوع من النتائج)
        onStartGame();
        gamesPromo?.classList.add('hidden');
        document.getElementById('theme-toggle')?.classList.add('hidden');
        gameStarted = true;
    });

    btnHowToPlay?.addEventListener('click', () => {
        howToPlayPanel?.classList.toggle('hidden');
        settingsPanel?.classList.add('hidden');
    });

    btnSettings?.addEventListener('click', () => {
        settingsPanel?.classList.toggle('hidden');
        howToPlayPanel?.classList.add('hidden');
    });

    btnDeveloper?.addEventListener('click', () => {
        developerModal?.classList.remove('hidden');
        gamesPromo?.classList.add('hidden');
    });

    developerClose?.addEventListener('click', () => {
        developerModal?.classList.add('hidden');
        gamesPromo?.classList.remove('hidden');
    });

    developerModal?.addEventListener('click', (event) => {
        if (event.target === developerModal) {
            developerModal.classList.add('hidden');
            gamesPromo?.classList.remove('hidden');
        }
    });

    // تم التعديل هنا: فتح بوب أب التأكيد بدل الرجوع المباشر
    function openBackConfirm() {
        backConfirmModal?.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    backToMenuDesktop?.addEventListener('click', openBackConfirm);
    backToMenuMobile?.addEventListener('click', openBackConfirm);

    cancelBackBtn?.addEventListener('click', () => {
        backConfirmModal?.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    });

    backConfirmModal?.addEventListener('click', (event) => {
        if (event.target === backConfirmModal) {
            backConfirmModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    });

    confirmBackBtn?.addEventListener('click', () => {
        backConfirmModal?.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        gameScreen?.classList.add('hidden');
        welcomeScreen?.classList.remove('hidden');
        gamesPromo?.classList.remove('hidden');
        document.getElementById('theme-toggle')?.classList.remove('hidden');
        onBackToMenu?.();
    });
}