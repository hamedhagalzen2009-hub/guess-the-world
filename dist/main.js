import { initUI } from './ui.js';
import { categories } from './data.js';
import { initSettingsFilter } from './settingsFilter.js';
// تم التعديل هنا: استيراد دوال شاشة النتائج من ملف مستقل
import { initResults, recordResult, resetResults, showResultsScreen } from './results.js';
import { initKeyboard, setKeyboardForWord, updateKeyboardColors, resetKeyboardColors } from './keyboard.js';
import { initAchievements, incrementRoundsPlayed, getStats, getUnlockedIds } from './achievements.js';
import { initLeaderboardBar, setLeaderboardControlsVisible } from './leaderboardBar.js';
import { saveMyResults } from './leaderboard.js';
// اختيار الفئات
const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
const categoryWarning = document.getElementById('category-warning');
const MIN_SELECTED_CATEGORIES = 3;
function getSelectedCategoryNames() {
    return Array.from(categoryCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => { var _a; return (_a = cb.dataset.category) !== null && _a !== void 0 ? _a : ''; });
}
function getActiveCategories() {
    const selectedNames = getSelectedCategoryNames();
    const filtered = categories.filter((c) => selectedNames.indexOf(c.name) !== -1);
    // لو لأي سبب النتيجة فاضية، نرجع لكل الفئات كاحتياط أمان
    return filtered.length > 0 ? filtered : categories;
}
categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        const checkedCount = getSelectedCategoryNames().length;
        if (checkedCount < MIN_SELECTED_CATEGORIES) {
            categoryWarning === null || categoryWarning === void 0 ? void 0 : categoryWarning.classList.remove('hidden');
            setTimeout(() => {
                categoryWarning === null || categoryWarning === void 0 ? void 0 : categoryWarning.classList.add('hidden');
            }, 2000);
        }
        // تم التعديل هنا: كل ما المستخدم يغيّر اختياره، نتأكد من حالة زر ابدأ (يتفك أو يترقفل)
        checkStartUnlockCondition();
    });
});
// ===== قفل زر "ابدأ" لحد ما المستخدم يدخل الاعدادات ويأكد اختيار 3 توبيكس على الاقل =====
const startButton = document.getElementById('btn-start');
const settingsButton = document.getElementById('btn-settings');
const settingsDoneButton = document.getElementById('settings-done-btn');
const settingsCloseButton = document.getElementById('settings-close-btn');
let isStartUnlocked = false;
function lockStartButton() {
    if (!startButton)
        return;
    isStartUnlocked = false;
    startButton.classList.add('opacity-50', 'grayscale', 'cursor-not-allowed');
}
function unlockStartButton() {
    if (!startButton || isStartUnlocked)
        return;
    isStartUnlocked = true;
    startButton.classList.remove('opacity-50', 'grayscale', 'cursor-not-allowed');
    settingsButton === null || settingsButton === void 0 ? void 0 : settingsButton.classList.remove('anim-settings-attention');
}
// تشغيل حركة اللفت (يمين شمال + توهج) على زر الاعدادات عشان توجه المستخدم ليه
function playSettingsAttention() {
    if (!settingsButton)
        return;
    settingsButton.classList.remove('anim-settings-attention');
    // إعادة تشغيل الأنيميشن حتى لو كانت شغالة أصلاً (إعادة الفلو)
    void settingsButton.offsetWidth;
    settingsButton.classList.add('anim-settings-attention');
}
function checkStartUnlockCondition() {
    if (getSelectedCategoryNames().length >= MIN_SELECTED_CATEGORIES) {
        unlockStartButton();
    }
    else {
        lockStartButton();
    }
}
// طالما الزر مقفول، أي ضغطة عليه توقف تشغيل اللعبة وتلفت النظر لزر الاعدادات بدالها
startButton === null || startButton === void 0 ? void 0 : startButton.addEventListener('click', (e) => {
    if (isStartUnlocked)
        return;
    e.preventDefault();
    e.stopImmediatePropagation();
    playSettingsAttention();
}, true);
// لما المستخدم يدخل الاعدادات ويقفلها (Done أو X)، نتأكد من شرط الفتح
settingsDoneButton === null || settingsDoneButton === void 0 ? void 0 : settingsDoneButton.addEventListener('click', checkStartUnlockCondition);
settingsCloseButton === null || settingsCloseButton === void 0 ? void 0 : settingsCloseButton.addEventListener('click', checkStartUnlockCondition);
lockStartButton();
// settings panel
const selectTries = document.getElementById("select-tries");
const selectRounds = document.getElementById("select-rounds");
let numberOfTries = selectTries ? parseInt(selectTries.value) : 6;
let numberOfLetter = 6;
let numberOfHints = 2;
let curent = 1;
let guessToWord = '';
let selectedCategory = null;
let totalRounds = selectRounds ? parseInt(selectRounds.value) : 5;
let currentRound = 1;
const roundResults = [];
const isTouchDevice = window.matchMedia('(any-pointer: coarse)').matches;
// تم التعديل هنا: تسجيل حروف الهنت عشان تفضل موجودة في كل المحاولات الجاية
let hintedLetters = {};
function getMaxHints(wordLength) {
    return wordLength >= 7 ? 3 : 2;
}
const roundIndicator = document.getElementById('round-indicator');
const ROUND_INDICATOR_BASE = 'bg-[#eee] dark:bg-neutral-800 text-black dark:text-neutral-100 px-3 py-1.5 text-xs md:px-6 md:py-2.5 md:text-base rounded-sm font-bold uppercase border-2 border-black border-b-4';
const messageErea = document.querySelector('.massege');
const msgMobile = document.getElementById('msg-mobile');
const categoryImage = document.getElementById('category-image');
const categoryHint = document.getElementById('category-hint');
// Mobile-only hint bar
const mobileHintText = document.getElementById('mobile-hint-text');
const showImageBtn = document.getElementById('show-image-btn');
const imagePopupModal = document.getElementById('image-popup-modal');
const imagePopupImg = document.getElementById('image-popup-img');
const imagePopupCaption = document.getElementById('image-popup-caption');
const imagePopupClose = document.getElementById('image-popup-close');
function closeImagePopup() {
    imagePopupModal === null || imagePopupModal === void 0 ? void 0 : imagePopupModal.classList.add('hidden');
}
imagePopupClose === null || imagePopupClose === void 0 ? void 0 : imagePopupClose.addEventListener('click', closeImagePopup);
imagePopupModal === null || imagePopupModal === void 0 ? void 0 : imagePopupModal.addEventListener('click', (e) => {
    if (e.target === imagePopupModal)
        closeImagePopup();
});
// تم التعديل هنا: تحديث نص التلميح في شريط التلميحات المحمولة
function updateMobileHint() {
    var _a;
    if (!mobileHintText || !selectedCategory)
        return;
    mobileHintText.textContent = (_a = selectedCategory.hintText) !== null && _a !== void 0 ? _a : selectedCategory.name;
}
showImageBtn === null || showImageBtn === void 0 ? void 0 : showImageBtn.addEventListener('click', () => {
    if (!imagePopupImg || !selectedCategory)
        return;
    imagePopupImg.src = selectedCategory.image;
    imagePopupImg.alt = selectedCategory.name;
    if (imagePopupCaption)
        imagePopupCaption.textContent = selectedCategory.name;
    imagePopupModal === null || imagePopupModal === void 0 ? void 0 : imagePopupModal.classList.remove('hidden');
});
const usedWordsBag = new Set();
let lastPlayedWord = null;
function pickRandomWordAvoidingRepeat(activeCategories) {
    const allPairs = [];
    activeCategories.forEach((category) => {
        category.words.forEach((word) => allPairs.push({ category, word }));
    });
    if (allPairs.length === 0) {
        // احتياط أمان لا يفترض يحصل أبداً
        return { category: activeCategories[0], word: '' };
    }
    // المرشحين: أي كلمة لسه ما لعبناها من هذا الكيس
    let candidates = allPairs.filter((pair) => !usedWordsBag.has(pair.word.toLowerCase()));
    // الكيس خلص (كل الكلمات لعبت) -> نعيد التعبيه ونستبعد آخر كلمة عشان ما تتكرر فوراً
    if (candidates.length === 0) {
        usedWordsBag.clear();
        candidates = allPairs.filter((pair) => pair.word.toLowerCase() !== lastPlayedWord);
        if (candidates.length === 0) {
            candidates = allPairs;
        }
    }
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    usedWordsBag.add(picked.word.toLowerCase());
    lastPlayedWord = picked.word.toLowerCase();
    return picked;
}
function selectRound() {
    const activeCategories = getActiveCategories();
    const { category, word } = pickRandomWordAvoidingRepeat(activeCategories);
    selectedCategory = category;
    guessToWord = word.toLowerCase();
    numberOfLetter = guessToWord.length;
    setKeyboardForWord(guessToWord);
}
function showCategoryImage() {
    if (!categoryImage || !selectedCategory)
        return;
    categoryImage.src = selectedCategory.image;
    categoryImage.alt = selectedCategory.name;
    categoryImage.classList.remove('hidden');
}
function showCategoryHint() {
    if (!categoryHint || !selectedCategory)
        return;
    if (selectedCategory.hintText) {
        categoryHint.textContent = selectedCategory.hintText;
        categoryHint.classList.remove('hidden');
    }
    else {
        categoryHint.textContent = '';
        categoryHint.classList.add('hidden');
    }
}
const checkButton = document.getElementById('Check');
checkButton === null || checkButton === void 0 ? void 0 : checkButton.addEventListener('click', handelCheck);
const hintButton = document.getElementById('hint');
const hintCountElement = document.querySelector('#hint span');
if (hintCountElement) {
    hintCountElement.innerHTML = String(numberOfHints);
}
hintButton === null || hintButton === void 0 ? void 0 : hintButton.addEventListener('click', handelHints);
// تم التعديل هنا: inputs size
function getInputSizeClasses(length) {
    if (length <= 5) {
        return { box: 'h-11 w-11 md:h-16 md:w-16', margin: 'mx-1 md:mx-2.5', text: 'text-lg md:text-2xl dark:text-black' };
    }
    if (length <= 7) {
        return { box: 'h-9 w-9 md:h-14 md:w-14', margin: 'mx-0.5 md:mx-2', text: 'text-base md:text-xl dark:text-black' };
    }
    if (length <= 9) {
        return { box: 'h-8 w-8 md:h-12 md:w-12', margin: 'mx-0.5 md:mx-1.5', text: 'text-sm md:text-lg dark:text-black' };
    }
    return { box: 'h-7 w-7 md:h-10 md:w-10', margin: 'mx-0.5 md:mx-1', text: 'text-xs md:text-base dark:text-black' };
}
function generateInput() {
    var _a;
    const inputsContener = document.getElementsByClassName('inputs');
    const isArabicWord = /[\u0600-\u06FF]/.test(guessToWord);
    for (let i = 1; i <= numberOfTries; i++) {
        const div = document.createElement('div');
        div.className = `try-${i} mb-5 flex items-center justify-center`;
        div.innerHTML = `<span class='size-10'>Try ${i}<span/>`;
        if (i !== 1) {
            div.className = `try-${i} disabled opacity-50 pointer-events-none mb-5 flex items-center justify-center`;
        }
        if (isArabicWord) {
            div.setAttribute('dir', 'rtl');
        }
        for (let j = 1; j <= numberOfLetter; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            const s = getInputSizeClasses(numberOfLetter);
            input.className = `input ${s.margin} my-0 ${s.box} ${s.text} text-center caret-[#333] bg-white border-b-2 border-b-black focus:outline-[#ccc] focus:outline-1.5 focus:border-none`;
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute('maxlength', '1');
            if (isTouchDevice) {
                input.setAttribute('inputmode', 'none');
            }
            input.setAttribute('autocomplete', 'off');
            // احتياط إضافي لـ Chrome على أندرويد اللي أحياناً بيتجاهل inputmode
            input.addEventListener('touchstart', (e) => {
                e.preventDefault();
                input.focus();
            });
            div.appendChild(input);
        }
        (_a = inputsContener[0]) === null || _a === void 0 ? void 0 : _a.appendChild(div);
    }
    const inputeInDisabledMode = document.querySelectorAll('.disabled input');
    inputeInDisabledMode.forEach((input) => (input.disabled = true));
    const inputs = document.querySelectorAll('.input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.toUpperCase();
            const nextInput = inputs[index + 1];
            if (nextInput)
                nextInput.focus();
        });
        input.addEventListener('keydown', function (event) {
            const currentIndex = Array.from(inputs).indexOf(input);
            if (event.key === 'ArrowRight') {
                const targetIndex = isArabicWord ? currentIndex - 1 : currentIndex + 1;
                if (targetIndex >= 0 && targetIndex < inputs.length)
                    inputs[targetIndex].focus();
            }
            if (event.key === 'ArrowLeft') {
                const targetIndex = isArabicWord ? currentIndex + 1 : currentIndex - 1;
                if (targetIndex >= 0 && targetIndex < inputs.length)
                    inputs[targetIndex].focus();
            }
            if (event.key === 'Backspace') {
                event.preventDefault();
                if (input.readOnly) {
                    // تم التعديل هنا: خانة هنت، مينفعش تتمسح
                }
                else if (input.value !== '') {
                    input.value = '';
                }
                else if (currentIndex > 0) {
                    const prevInput = inputs[currentIndex - 1];
                    if (prevInput && !prevInput.readOnly) {
                        prevInput.value = '';
                        prevInput.focus();
                    }
                    else if (prevInput) {
                        prevInput.focus();
                    }
                }
            }
            if (event.key === 'Enter') {
                event.preventDefault();
                handelCheck();
            }
        });
    });
}
// settings panel listeners
selectTries === null || selectTries === void 0 ? void 0 : selectTries.addEventListener("change", (e) => {
    const target = e.target;
    numberOfTries = parseInt(target.value);
});
selectRounds === null || selectRounds === void 0 ? void 0 : selectRounds.addEventListener("change", (e) => {
    const target = e.target;
    totalRounds = parseInt(target.value);
});
function handelCheck() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let success = true;
    const currentInputs = [];
    const targetWordLetters = guessToWord.split('');
    const letterCounts = {};
    // Check if all inputs are filled and success
    function shakeRow(rowEl) {
        if (!rowEl)
            return;
        rowEl.classList.add('anim-shake');
        rowEl.addEventListener('animationend', () => {
            rowEl.classList.remove('anim-shake');
        }, { once: true });
    }
    function pulseRowCorrect(rowEl) {
        if (!rowEl)
            return;
        rowEl.classList.add('anim-pulse-correct');
        setTimeout(() => {
            rowEl.classList.remove('anim-pulse-correct');
        }, 650);
    }
    for (const letter of targetWordLetters) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
    for (let i = 1; i <= numberOfLetter; i++) {
        const inputFiled = document.querySelector(`#guess-${curent}-letter-${i}`);
        const val = inputFiled && inputFiled.value ? inputFiled.value.toLowerCase() : '';
        currentInputs.push({
            element: inputFiled,
            letter: val,
            status: '',
        });
    }
    const s = getInputSizeClasses(numberOfLetter);
    const baseClasses = `input ${s.margin} my-0 ${s.box} ${s.text} text-center font-bold uppercase text-white caret-[#333] border-none transition-colors duration-300`;
    currentInputs.forEach((item, index) => {
        if (!item.element)
            return;
        const actualLetter = guessToWord[index];
        if (item.letter === actualLetter) {
            item.status = 'win';
            letterCounts[item.letter]--;
        }
        else {
            success = false;
        }
    });
    currentInputs.forEach((item) => {
        var _a;
        if (!item.element)
            return;
        if (item.status === 'win') {
            item.element.className = `${baseClasses} bg-win`;
            return;
        }
        const letter = item.letter;
        const availableCount = (_a = letterCounts[letter]) !== null && _a !== void 0 ? _a : 0;
        if (letter !== '' && availableCount > 0) {
            item.status = 'mud'; // NEW: record only (coloring logic unchanged)
            item.element.className = `${baseClasses} bg-mud`;
            letterCounts[letter] = availableCount - 1;
        }
        else {
            item.status = 'lose'; // NEW: record only
            item.element.className = `${baseClasses} bg-lose`;
        }
    });
    updateKeyboardColors(currentInputs.map((it) => ({ letter: it.letter, status: it.status })));
    if (success) {
        (_b = (_a = window).playSfx) === null || _b === void 0 ? void 0 : _b.call(_a, 'correct');
        pulseRowCorrect(document.querySelector(`.try-${curent}`));
        roundResults.push(true);
        incrementRoundsPlayed(true, curent, numberOfHints < getMaxHints(numberOfLetter));
        // تم التعديل هنا: تسجيل إجابة صحيحة في عدّاد النتائج
        recordResult(true);
        setRoundIndicatorEnabled(true);
        const allTriesDivs = document.querySelectorAll('.inputs > div');
        allTriesDivs.forEach((div) => {
            div.classList.add('disabled', 'opacity-50', 'pointer-events-none');
        });
        const allInputs = document.querySelectorAll('.input');
        allInputs.forEach((input) => {
            input.disabled = true;
        });
        if (checkButton) {
            checkButton.setAttribute('disabled', 'true');
            checkButton.classList.add('opacity-50', 'pointer-events-none');
        }
        if (hintButton) {
            hintButton.setAttribute('disabled', 'true');
            hintButton.classList.add('opacity-50', 'pointer-events-none');
        }
    }
    else {
        (_d = (_c = window).playSfx) === null || _d === void 0 ? void 0 : _d.call(_c, 'wrong');
        shakeRow(document.querySelector(`.try-${curent}`));
        (_e = document.querySelector(`.try-${curent}`)) === null || _e === void 0 ? void 0 : _e.classList.add('disabled', 'opacity-50', 'pointer-events-none');
        const curentTry = document.querySelectorAll(`.try-${curent} input`);
        curentTry.forEach((input) => {
            input.disabled = true;
        });
        curent++;
        const nextCurentTry = document.querySelectorAll(`.try-${curent} input`);
        nextCurentTry.forEach((input) => {
            input.disabled = false;
        });
        const el = document.querySelector(`.try-${curent}`);
        if (el) {
            (_f = document.querySelector(`.try-${curent}`)) === null || _f === void 0 ? void 0 : _f.classList.remove('disabled', 'opacity-50', 'pointer-events-none');
            const firstNextInput = el.querySelector('input');
            if (firstNextInput)
                firstNextInput.focus();
        }
        else {
            (_h = (_g = window).playSfx) === null || _h === void 0 ? void 0 : _h.call(_g, 'gameOver');
            roundResults.push(false);
            incrementRoundsPlayed(false, curent, numberOfHints < getMaxHints(numberOfLetter));
            // تم التعديل هنا: تسجيل إجابة خاطئة في عدّاد النتائج
            recordResult(false);
            setRoundIndicatorEnabled(true);
            if (checkButton) {
                checkButton.setAttribute('disabled', 'true');
                checkButton.classList.add('opacity-50', 'pointer-events-none');
            }
            if (hintButton) {
                hintButton.setAttribute('disabled', 'true');
                hintButton.classList.add('opacity-50', 'pointer-events-none');
            }
            // تم التعديل هنا: إزالة رسالة الخسارة القديمة من .massege
            if (messageErea) {
                messageErea.innerHTML = `<span class="block mx-auto text-3xl mt-2.5 text-center font-bold capitalize text-lose">${guessToWord}</span>`;
            }
            if (msgMobile) {
                msgMobile.innerHTML = `<span class="block mx-auto text-2xl md:text-3xl font-bold tracking-wide capitalize text-lose">${guessToWord}</span>`;
                msgMobile.classList.remove('hidden');
            }
        }
    }
}
function handelHints() {
    if (numberOfHints <= 0)
        return;
    const enabledInputs = Array.from(document.querySelectorAll(`.try-${curent} input:not([disabled])`));
    const validInputsForHint = enabledInputs.filter((input, index) => {
        if (input.value !== '')
            return false;
        for (let t = 1; t < curent; t++) {
            const prevInput = document.querySelector(`#guess-${t}-letter-${index + 1}`);
            if (prevInput && prevInput.classList.contains('bg-win')) {
                return false;
            }
        }
        return true;
    });
    if (validInputsForHint.length === 0)
        return;
    numberOfHints--;
    if (hintCountElement) {
        hintCountElement.innerHTML = String(numberOfHints);
    }
    if (numberOfHints === 0 && hintButton) {
        hintButton.disabled = true;
        hintButton.classList.add('opacity-40', 'cursor-no-drop');
        hintButton.classList.remove('active:bg-sky-900', 'active:scale-93');
    }
    const randomIndex = Math.floor(Math.random() * validInputsForHint.length);
    const randomInput = validInputsForHint[randomIndex];
    if (!randomInput)
        return;
    const indexToFill = enabledInputs.indexOf(randomInput);
    if (indexToFill !== -1 && guessToWord[indexToFill]) {
        randomInput.value = guessToWord[indexToFill].toUpperCase();
        randomInput.readOnly = true;
        // تم التعديل هنا: نحفظ الحرف عشان يظهر تلقائي في المحاولة الجاية
        hintedLetters[indexToFill] = guessToWord[indexToFill];
    }
}
function setRoundIndicatorEnabled(enabled) {
    if (!roundIndicator)
        return;
    roundIndicator.disabled = !enabled;
    roundIndicator.className = enabled
        ? `${ROUND_INDICATOR_BASE} cursor-pointer active:border-b-2 active:translate-y-0.5`
        : `${ROUND_INDICATOR_BASE} opacity-40 cursor-not-allowed`;
}
function updateRoundIndicator() {
    if (!roundIndicator)
        return;
    roundIndicator.textContent = `${currentRound} / ${totalRounds}`;
    setRoundIndicatorEnabled(false);
}
function resetBoard() {
    curent = 1;
    numberOfHints = getMaxHints(numberOfLetter);
    hintedLetters = {};
    resetKeyboardColors();
    if (hintCountElement) {
        hintCountElement.innerHTML = String(numberOfHints);
    }
    if (messageErea) {
        messageErea.innerHTML = '';
    }
    if (msgMobile) {
        msgMobile.innerHTML = '';
        msgMobile.classList.add('hidden');
    }
    if (checkButton) {
        checkButton.removeAttribute('disabled');
        checkButton.classList.remove('opacity-50', 'pointer-events-none');
    }
    if (hintButton) {
        hintButton.removeAttribute('disabled');
        hintButton.classList.remove('opacity-50', 'pointer-events-none', 'opacity-40', 'cursor-no-drop');
    }
    const inputsContener = document.getElementsByClassName('inputs');
    if (inputsContener[0]) {
        inputsContener[0].innerHTML = '';
    }
    generateInput();
}
function advanceRound() {
    if (currentRound < totalRounds) {
        currentRound++;
        selectRound();
        showCategoryImage();
        showCategoryHint();
        resetBoard();
        updateRoundIndicator();
        updateMobileHint();
        closeImagePopup();
    }
    else {
        // تم التعديل هنا: عرض شاشة النتائج بدل رسالة GAME COMPLETED في .massege
        if (messageErea) {
            messageErea.innerHTML = '';
        }
        if (msgMobile) {
            msgMobile.innerHTML = '';
            msgMobile.classList.add('hidden');
        }
        if (roundIndicator) {
            roundIndicator.disabled = true;
            roundIndicator.classList.add('hidden');
        }
        showResultsScreen();
        // بتحفظ في Firestore لو المستخدم مسجل دخول فقط (saveMyResults نفسها بتتأكد من ده)
        saveMyResults(getStats(), getUnlockedIds());
    }
}
roundIndicator === null || roundIndicator === void 0 ? void 0 : roundIndicator.addEventListener('click', advanceRound);
// تم التعديل هنا: إعادة تشغيل لعبة جديدة من شاشة النتائج
function restartGame() {
    setLeaderboardControlsVisible(false);
    currentRound = 1;
    roundResults.length = 0;
    numberOfTries = selectTries ? parseInt(selectTries.value) : 6;
    totalRounds = selectRounds ? parseInt(selectRounds.value) : 5;
    if (roundIndicator) {
        roundIndicator.classList.remove('hidden');
    }
    selectRound();
    showCategoryImage();
    showCategoryHint();
    resetBoard();
    updateRoundIndicator();
    updateMobileHint();
    closeImagePopup();
}
// تم التعديل هنا: ربط أزرار Retry و Back to Home
initResults({
    onRetry: () => {
        var _a, _b;
        (_a = document.getElementById('games-promo-container')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
        (_b = document.getElementById('theme-toggle')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
        restartGame();
    },
    onBackHome: () => {
        var _a, _b;
        resetResults();
        currentRound = 1;
        roundResults.length = 0;
        setLeaderboardControlsVisible(true);
        (_a = document.getElementById('games-promo-container')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        (_b = document.getElementById('theme-toggle')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
    },
});
// npx @tailwindcss/cli -i ./style.css -o ./output.css --watch
initSettingsFilter();
initKeyboard();
initAchievements();
initLeaderboardBar();
initUI(() => {
    restartGame();
}, () => {
    resetResults();
    currentRound = 1;
    roundResults.length = 0;
});
