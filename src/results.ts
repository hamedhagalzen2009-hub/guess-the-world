import { maybeShowPerfectVideo } from './perfectVideo.js';

let correctCount = 0;
let wrongCount = 0;

let onRetryGame: (() => void) | null = null;
let onBackHome: (() => void) | null = null;

function getResultsScreen(): HTMLElement | null {
    return document.getElementById('results-screen');
}

function getGameScreen(): HTMLElement | null {
    return document.getElementById('game-screen');
}

function getWelcomeScreen(): HTMLElement | null {
    return document.getElementById('welcome-screen');
}

function getCorrectCountEl(): HTMLElement | null {
    return document.getElementById('results-correct-count');
}

function getWrongCountEl(): HTMLElement | null {
    return document.getElementById('results-wrong-count');
}

export function recordResult(isCorrect: boolean): void {
    if (isCorrect) {
        correctCount++;
    } else {
        wrongCount++;
    }
}

export function resetResults(): void {
    correctCount = 0;
    wrongCount = 0;
}

export function showResultsScreen(): void {
    const resultsScreen = getResultsScreen();
    const gameScreen = getGameScreen();
    const correctEl = getCorrectCountEl();
    const wrongEl = getWrongCountEl();

    if (correctEl) correctEl.textContent = String(correctCount);
    if (wrongEl) wrongEl.textContent = String(wrongCount);

    gameScreen?.classList.add('hidden');
    resultsScreen?.classList.remove('hidden');

    const totalRounds = correctCount + wrongCount;
    maybeShowPerfectVideo(correctCount, wrongCount, totalRounds);
}

export function hideResultsScreen(): void {
    getResultsScreen()?.classList.add('hidden');
}

export function initResults(handlers: {
    onRetry: () => void;
    onBackHome: () => void;
}): void {
    onRetryGame = handlers.onRetry;
    onBackHome = handlers.onBackHome;

    const retryButton = document.getElementById('retry-button');
    const backHomeButton = document.getElementById('back-home-button');

    retryButton?.addEventListener('click', () => {
        resetResults();
        hideResultsScreen();
        getWelcomeScreen()?.classList.add('hidden');
        getGameScreen()?.classList.remove('hidden');
        onRetryGame?.();
    });

    backHomeButton?.addEventListener('click', () => {
        hideResultsScreen();
        getGameScreen()?.classList.add('hidden');
        getWelcomeScreen()?.classList.remove('hidden');
        onBackHome?.();
    });
}
