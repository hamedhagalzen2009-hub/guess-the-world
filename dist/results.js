import { maybeShowPerfectVideo } from './perfectVideo.js';
let correctCount = 0;
let wrongCount = 0;
let onRetryGame = null;
let onBackHome = null;
function getResultsScreen() {
    return document.getElementById('results-screen');
}
function getGameScreen() {
    return document.getElementById('game-screen');
}
function getWelcomeScreen() {
    return document.getElementById('welcome-screen');
}
function getCorrectCountEl() {
    return document.getElementById('results-correct-count');
}
function getWrongCountEl() {
    return document.getElementById('results-wrong-count');
}
export function recordResult(isCorrect) {
    if (isCorrect) {
        correctCount++;
    }
    else {
        wrongCount++;
    }
}
export function resetResults() {
    correctCount = 0;
    wrongCount = 0;
}
export function showResultsScreen() {
    const resultsScreen = getResultsScreen();
    const gameScreen = getGameScreen();
    const correctEl = getCorrectCountEl();
    const wrongEl = getWrongCountEl();
    if (correctEl)
        correctEl.textContent = String(correctCount);
    if (wrongEl)
        wrongEl.textContent = String(wrongCount);
    gameScreen === null || gameScreen === void 0 ? void 0 : gameScreen.classList.add('hidden');
    resultsScreen === null || resultsScreen === void 0 ? void 0 : resultsScreen.classList.remove('hidden');
    const totalRounds = correctCount + wrongCount;
    maybeShowPerfectVideo(correctCount, wrongCount, totalRounds);
}
export function hideResultsScreen() {
    var _a;
    (_a = getResultsScreen()) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
}
export function initResults(handlers) {
    onRetryGame = handlers.onRetry;
    onBackHome = handlers.onBackHome;
    const retryButton = document.getElementById('retry-button');
    const backHomeButton = document.getElementById('back-home-button');
    retryButton === null || retryButton === void 0 ? void 0 : retryButton.addEventListener('click', () => {
        var _a, _b;
        resetResults();
        hideResultsScreen();
        (_a = getWelcomeScreen()) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = getGameScreen()) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        onRetryGame === null || onRetryGame === void 0 ? void 0 : onRetryGame();
    });
    backHomeButton === null || backHomeButton === void 0 ? void 0 : backHomeButton.addEventListener('click', () => {
        var _a, _b;
        hideResultsScreen();
        (_a = getGameScreen()) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = getWelcomeScreen()) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        onBackHome === null || onBackHome === void 0 ? void 0 : onBackHome();
    });
}
