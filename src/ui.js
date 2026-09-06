const gameName = 'Gusse The World';
export function initUI(onStartGame) {
    document.title = gameName;
    const gameHeader = document.querySelector('.game-header');
    if (gameHeader)
        gameHeader.innerHTML = gameName;
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
    btnStart === null || btnStart === void 0 ? void 0 : btnStart.addEventListener('click', () => {
        welcomeScreen === null || welcomeScreen === void 0 ? void 0 : welcomeScreen.classList.add('hidden');
        gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.classList.remove('hidden');
        if (!gameStarted) {
            onStartGame();
            gameStarted = true;
        }
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
    });
    developerClose === null || developerClose === void 0 ? void 0 : developerClose.addEventListener('click', () => {
        developerModal === null || developerModal === void 0 ? void 0 : developerModal.classList.add('hidden');
    });
    developerModal === null || developerModal === void 0 ? void 0 : developerModal.addEventListener('click', (event) => {
        if (event.target === developerModal) {
            developerModal.classList.add('hidden');
        }
    });
}
