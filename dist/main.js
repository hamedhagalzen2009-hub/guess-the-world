import { initUI } from './ui.js';
import { categories } from './data.js';
// تم التعديل هنا: استيراد دوال شاشة النتائج من ملف مستقل
import { initResults, recordResult, resetResults, showResultsScreen } from './results.js';
import { initKeyboard, setKeyboardForWord, updateKeyboardColors, resetKeyboardColors } from './keyboard.js';
import { initAchievements, incrementRoundsPlayed } from './achievements.js';
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
            checkbox.checked = true;
            categoryWarning === null || categoryWarning === void 0 ? void 0 : categoryWarning.classList.remove('hidden');
            setTimeout(() => {
                categoryWarning === null || categoryWarning === void 0 ? void 0 : categoryWarning.classList.add('hidden');
            }, 2000);
        }
    });
});
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
function selectRound() {
    var _a;
    const activeCategories = getActiveCategories();
    const category = activeCategories[Math.floor(Math.random() * activeCategories.length)];
    const word = (_a = category.words[Math.floor(Math.random() * category.words.length)]) !== null && _a !== void 0 ? _a : '';
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
        return { box: 'h-16 w-16 sm:h-16 sm:w-16', margin: 'mx-2 sm:mx-2.5', text: 'text-2xl sm:text-2xl dark:text-black' };
    }
    if (length <= 7) {
        return { box: 'h-14 w-14 sm:h-14 sm:w-14', margin: 'mx-1.5 sm:mx-2', text: 'text-xl sm:text-xl dark:text-black' };
    }
    if (length <= 9) {
        return { box: 'h-12 w-12 sm:h-12 sm:w-12', margin: 'mx-1 sm:mx-1.5', text: 'text-lg sm:text-lg dark:text-black' };
    }
    return { box: 'h-10 w-10 sm:h-10 sm:w-10', margin: 'mx-0.5 sm:mx-1', text: 'text-base sm:text-base dark:text-black' };
}
function generateInput() {
    var _a;
    const inputsContener = document.getElementsByClassName('inputs');
    for (let i = 1; i <= numberOfTries; i++) {
        const div = document.createElement('div');
        div.className = `try-${i} mb-5 flex items-center justify-center`;
        div.innerHTML = `<span class='size-10'>Try ${i}<span/>`;
        if (i !== 1) {
            div.className = `try-${i} disabled opacity-50 pointer-events-none mb-5 flex items-center justify-center`;
        }
        for (let j = 1; j <= numberOfLetter; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            const s = getInputSizeClasses(numberOfLetter);
            input.className = `input ${s.margin} my-0 ${s.box} ${s.text} text-center caret-[#333] bg-white border-b-2 border-b-black focus:outline-[#ccc] focus:outline-1.5 focus:border-none`;
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute('maxlength', '1');
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
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length)
                    inputs[nextInput].focus();
            }
            if (event.key === 'ArrowLeft') {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0)
                    inputs[prevInput].focus();
            }
            if (event.key === 'Backspace') {
                event.preventDefault();
                if (input.value !== '') {
                    input.value = '';
                }
                else if (currentIndex > 0) {
                    const prevInput = inputs[currentIndex - 1];
                    if (prevInput) {
                        prevInput.value = '';
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
        incrementRoundsPlayed();
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
            incrementRoundsPlayed();
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
    numberOfHints = 2;
    resetKeyboardColors();
    if (hintCountElement) {
        hintCountElement.innerHTML = String(numberOfHints);
    }
    if (messageErea) {
        messageErea.innerHTML = '';
    }
    if (msgMobile) {
        msgMobile.innerHTML = '';
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
        }
        if (roundIndicator) {
            roundIndicator.disabled = true;
            roundIndicator.classList.add('hidden');
        }
        showResultsScreen();
    }
}
roundIndicator === null || roundIndicator === void 0 ? void 0 : roundIndicator.addEventListener('click', advanceRound);
// تم التعديل هنا: إعادة تشغيل لعبة جديدة من شاشة النتائج
function restartGame() {
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
        (_a = document.getElementById('games-promo-container')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        (_b = document.getElementById('theme-toggle')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
    },
});
// npx @tailwindcss/cli -i ./src/style.css -o ./dist/output.css --watch
// لا تحذف الكود الذي فوقي
initKeyboard();
initAchievements();
initUI(() => {
    restartGame();
}, () => {
    resetResults();
    currentRound = 1;
    roundResults.length = 0;
});
