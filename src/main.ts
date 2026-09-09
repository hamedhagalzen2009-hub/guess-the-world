import { initUI } from './ui.js';
import { categories, type Category } from './data.js';
import { initSettingsFilter } from './settingsFilter.js';
// تم التعديل هنا: استيراد دوال شاشة النتائج من ملف مستقل
import { initResults, recordResult, resetResults, showResultsScreen } from './results.js';
import { initKeyboard, setKeyboardForWord, updateKeyboardColors, resetKeyboardColors } from './keyboard.js';
import { initAchievements, incrementRoundsPlayed } from './achievements.js';

// اختيار الفئات
const categoryCheckboxes = document.querySelectorAll<HTMLInputElement>('.category-checkbox');
const categoryWarning = document.getElementById('category-warning');
const MIN_SELECTED_CATEGORIES = 3;

function getSelectedCategoryNames(): string[] {
    return Array.from(categoryCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.dataset.category ?? '');
}

function getActiveCategories(): Category[] {
    const selectedNames = getSelectedCategoryNames();
    const filtered = categories.filter((c) => selectedNames.indexOf(c.name) !== -1);
    // لو لأي سبب النتيجة فاضية، نرجع لكل الفئات كاحتياط أمان
    return filtered.length > 0 ? filtered : categories;
}

categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        const checkedCount = getSelectedCategoryNames().length;

        if (checkedCount < MIN_SELECTED_CATEGORIES) {
            categoryWarning?.classList.remove('hidden');
            setTimeout(() => {
                categoryWarning?.classList.add('hidden');
            }, 2000);
        }

        // تم التعديل هنا: كل ما المستخدم يغيّر اختياره، نتأكد من حالة زر ابدأ (يتفك أو يترقفل)
        checkStartUnlockCondition();
    });
});

// ===== قفل زر "ابدأ" لحد ما المستخدم يدخل الاعدادات ويأكد اختيار 3 توبيكس على الاقل =====
const startButton = document.getElementById('btn-start') as HTMLButtonElement | null;
const settingsButton = document.getElementById('btn-settings');
const settingsDoneButton = document.getElementById('settings-done-btn');
const settingsCloseButton = document.getElementById('settings-close-btn');
let isStartUnlocked = false;

function lockStartButton(): void {
    if (!startButton) return;
    isStartUnlocked = false;
    startButton.classList.add('opacity-50', 'grayscale', 'cursor-not-allowed');
}

function unlockStartButton(): void {
    if (!startButton || isStartUnlocked) return;
    isStartUnlocked = true;
    startButton.classList.remove('opacity-50', 'grayscale', 'cursor-not-allowed');
    settingsButton?.classList.remove('anim-settings-attention');
}

// تشغيل حركة اللفت (يمين شمال + توهج) على زر الاعدادات عشان توجه المستخدم ليه
function playSettingsAttention(): void {
    if (!settingsButton) return;
    settingsButton.classList.remove('anim-settings-attention');
    // إعادة تشغيل الأنيميشن حتى لو كانت شغالة أصلاً (إعادة الفلو)
    void (settingsButton as HTMLElement).offsetWidth;
    settingsButton.classList.add('anim-settings-attention');
}

function checkStartUnlockCondition(): void {
    if (getSelectedCategoryNames().length >= MIN_SELECTED_CATEGORIES) {
        unlockStartButton();
    } else {
        lockStartButton();
    }
}

// طالما الزر مقفول، أي ضغطة عليه توقف تشغيل اللعبة وتلفت النظر لزر الاعدادات بدالها
startButton?.addEventListener(
    'click',
    (e) => {
        if (isStartUnlocked) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        playSettingsAttention();
    },
    true
);

// لما المستخدم يدخل الاعدادات ويقفلها (Done أو X)، نتأكد من شرط الفتح
settingsDoneButton?.addEventListener('click', checkStartUnlockCondition);
settingsCloseButton?.addEventListener('click', checkStartUnlockCondition);

lockStartButton();

// settings panel
const selectTries = document.getElementById("select-tries") as HTMLSelectElement | null;
const selectRounds = document.getElementById("select-rounds") as HTMLSelectElement | null;

let numberOfTries = selectTries ? parseInt(selectTries.value) : 6;
let numberOfLetter = 6;
let numberOfHints = 2;
let curent = 1;
let guessToWord = '';
let selectedCategory: Category | null = null;
let totalRounds = selectRounds ? parseInt(selectRounds.value) : 5;
let currentRound = 1;
const roundResults: boolean[] = [];
// تم التعديل هنا: تسجيل حروف الهنت عشان تفضل موجودة في كل المحاولات الجاية
let hintedLetters: Record<number, string> = {};
function getMaxHints(wordLength: number): number {
    return wordLength >= 7 ? 3 : 2;
}
const roundIndicator = document.getElementById('round-indicator') as HTMLButtonElement | null;
const ROUND_INDICATOR_BASE = 'bg-[#eee] dark:bg-neutral-800 text-black dark:text-neutral-100 px-3 py-1.5 text-xs md:px-6 md:py-2.5 md:text-base rounded-sm font-bold uppercase border-2 border-black border-b-4';

const messageErea = document.querySelector('.massege');
const msgMobile = document.getElementById('msg-mobile');
const categoryImage = document.getElementById('category-image') as HTMLImageElement | null;
const categoryHint = document.getElementById('category-hint');

// Mobile-only hint bar
const mobileHintText = document.getElementById('mobile-hint-text');
const showImageBtn = document.getElementById('show-image-btn');
const imagePopupModal = document.getElementById('image-popup-modal');
const imagePopupImg = document.getElementById('image-popup-img') as HTMLImageElement | null;
const imagePopupCaption = document.getElementById('image-popup-caption');
const imagePopupClose = document.getElementById('image-popup-close');

function closeImagePopup(): void {
    imagePopupModal?.classList.add('hidden');
}

imagePopupClose?.addEventListener('click', closeImagePopup);
imagePopupModal?.addEventListener('click', (e) => {
    if (e.target === imagePopupModal) closeImagePopup();
});

// تم التعديل هنا: تحديث نص التلميح في شريط التلميحات المحمولة
function updateMobileHint(): void {
    if (!mobileHintText || !selectedCategory) return;
    mobileHintText.textContent = selectedCategory.hintText ?? selectedCategory.name;
}

showImageBtn?.addEventListener('click', () => {
    if (!imagePopupImg || !selectedCategory) return;
    imagePopupImg.src = selectedCategory.image;
    imagePopupImg.alt = selectedCategory.name;
    if (imagePopupCaption) imagePopupCaption.textContent = selectedCategory.name;
    imagePopupModal?.classList.remove('hidden');
});


// ===== خوارزمية اختيار الكلمة بدون تكرار (Shuffle Bag) =====
// الفكرة: نمنع تكرار أي كلمة لحد ما "الكيس" (كل الكلمات بالفئات المفعّلة) يخلص كامل،
// وبعدين نعيد تعبيته من جديد بس نستبعد آخر كلمة لعبها اللاعب عشان ما تتكرر مباشرة بعد إعادة التعبيه.
interface WordPair {
    category: Category;
    word: string;
}

const usedWordsBag = new Set<string>();
let lastPlayedWord: string | null = null;

function pickRandomWordAvoidingRepeat(activeCategories: Category[]): WordPair {
    const allPairs: WordPair[] = [];
    activeCategories.forEach((category) => {
        category.words.forEach((word) => allPairs.push({ category, word }));
    });

    if (allPairs.length === 0) {
        // احتياط أمان لا يفترض يحصل أبداً
        return { category: activeCategories[0]!, word: '' };
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

    const picked = candidates[Math.floor(Math.random() * candidates.length)]!;
    usedWordsBag.add(picked.word.toLowerCase());
    lastPlayedWord = picked.word.toLowerCase();
    return picked;
}

function selectRound(): void {
    const activeCategories = getActiveCategories();
    const { category, word } = pickRandomWordAvoidingRepeat(activeCategories);

    selectedCategory = category;
    guessToWord = word.toLowerCase();
    numberOfLetter = guessToWord.length;
    setKeyboardForWord(guessToWord);
}

function showCategoryImage(): void {
    if (!categoryImage || !selectedCategory) return;

    categoryImage.src = selectedCategory.image;
    categoryImage.alt = selectedCategory.name;
    categoryImage.classList.remove('hidden');
}

function showCategoryHint(): void {
    if (!categoryHint || !selectedCategory) return;

    if (selectedCategory.hintText) {
        categoryHint.textContent = selectedCategory.hintText;
        categoryHint.classList.remove('hidden');
    } else {
        categoryHint.textContent = '';
        categoryHint.classList.add('hidden');
    }
}

const checkButton = document.getElementById('Check');
checkButton?.addEventListener('click', handelCheck);

const hintButton = document.getElementById('hint') as HTMLButtonElement | null;
const hintCountElement = document.querySelector('#hint span');
if (hintCountElement) {
    hintCountElement.innerHTML = String(numberOfHints);
}
hintButton?.addEventListener('click', handelHints);

// تم التعديل هنا: inputs size
function getInputSizeClasses(length: number): { box: string; margin: string; text: string } {
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
            input.setAttribute('inputmode', 'none');
            input.setAttribute('autocomplete', 'off');
            // احتياط إضافي لـ Chrome على أندرويد اللي أحياناً بيتجاهل inputmode
            input.addEventListener('touchstart', (e) => {
                e.preventDefault();
                input.focus();
            });
            div.appendChild(input);
        }

        inputsContener[0]?.appendChild(div);
    }

    const inputeInDisabledMode = document.querySelectorAll<HTMLInputElement>('.disabled input');
    inputeInDisabledMode.forEach((input) => (input.disabled = true));

    const inputs = document.querySelectorAll<HTMLInputElement>('.input');

    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.toUpperCase();
            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        });

        input.addEventListener('keydown', function (event) {
            const currentIndex = Array.from(inputs).indexOf(input);

            if (event.key === 'ArrowRight') {
                const targetIndex = isArabicWord ? currentIndex - 1 : currentIndex + 1;
                if (targetIndex >= 0 && targetIndex < inputs.length) inputs[targetIndex]!.focus();
            }

            if (event.key === 'ArrowLeft') {
                const targetIndex = isArabicWord ? currentIndex + 1 : currentIndex - 1;
                if (targetIndex >= 0 && targetIndex < inputs.length) inputs[targetIndex]!.focus();
            }

            if (event.key === 'Backspace') {
                event.preventDefault();

                if (input.readOnly) {
                    // تم التعديل هنا: خانة هنت، مينفعش تتمسح
                } else if (input.value !== '') {
                    input.value = '';
                } else if (currentIndex > 0) {
                    const prevInput = inputs[currentIndex - 1];
                    if (prevInput && !prevInput.readOnly) {
                        prevInput.value = '';
                        prevInput.focus();
                    } else if (prevInput) {
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
selectTries?.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    numberOfTries = parseInt(target.value);
});

selectRounds?.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement;
    totalRounds = parseInt(target.value);
});


function handelCheck() {
    let success = true;

    const currentInputs: { element: HTMLInputElement | null; letter: string; status: string }[] = [];
    const targetWordLetters = guessToWord.split('');
    const letterCounts: Record<string, number> = {};

    // Check if all inputs are filled and success
    function shakeRow(rowEl: Element | null): void {
        if (!rowEl) return;
        rowEl.classList.add('anim-shake');
        rowEl.addEventListener('animationend', () => {
        rowEl.classList.remove('anim-shake');
    }, { once: true });
}

    function pulseRowCorrect(rowEl: Element | null): void {
    if (!rowEl) return;
    rowEl.classList.add('anim-pulse-correct');
    setTimeout(() => {
        rowEl.classList.remove('anim-pulse-correct');
    }, 650);
}

    for (const letter of targetWordLetters) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }

    for (let i = 1; i <= numberOfLetter; i++) {
        const inputFiled = document.querySelector(`#guess-${curent}-letter-${i}`) as HTMLInputElement | null;
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
        if (!item.element) return;
        const actualLetter = guessToWord[index];

        if (item.letter === actualLetter) {
            item.status = 'win';
            letterCounts[item.letter]!--;
        } else {
            success = false;
        }
    });

    currentInputs.forEach((item) => {
        if (!item.element) return;

        if (item.status === 'win') {
            item.element.className = `${baseClasses} bg-win`;
            return;
        }

        const letter = item.letter;
        const availableCount = letterCounts[letter] ?? 0;

        if (letter !== '' && availableCount > 0) {
            item.status = 'mud'; // NEW: record only (coloring logic unchanged)
            item.element.className = `${baseClasses} bg-mud`;
            letterCounts[letter] = availableCount - 1;
        } else {
            item.status = 'lose'; // NEW: record only
            item.element.className = `${baseClasses} bg-lose`;
        }
    });

    updateKeyboardColors(currentInputs.map((it) => ({ letter: it.letter, status: it.status })));

if (success) {
        (window as any).playSfx?.('correct');
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
        const allInputs = document.querySelectorAll<HTMLInputElement>('.input');
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
    } else {
        (window as any).playSfx?.('wrong');
        shakeRow(document.querySelector(`.try-${curent}`));
        document.querySelector(`.try-${curent}`)?.classList.add('disabled', 'opacity-50', 'pointer-events-none');

        const curentTry = document.querySelectorAll(`.try-${curent} input`);
        curentTry.forEach((input) => {
            (input as HTMLInputElement).disabled = true;
        });

        curent++;

        const nextCurentTry = document.querySelectorAll(`.try-${curent} input`);
        nextCurentTry.forEach((input) => {
            (input as HTMLInputElement).disabled = false;
        });

        const el = document.querySelector(`.try-${curent}`);
        if (el) {
            document.querySelector(`.try-${curent}`)?.classList.remove('disabled', 'opacity-50', 'pointer-events-none');
            const firstNextInput = el.querySelector('input') as HTMLInputElement | null;
            if (firstNextInput) firstNextInput.focus();
                } else {
            (window as any).playSfx?.('gameOver');
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
    if (numberOfHints <= 0) return;

    const enabledInputs = Array.from(
        document.querySelectorAll<HTMLInputElement>(`.try-${curent} input:not([disabled])`)
    );

    const validInputsForHint = enabledInputs.filter((input, index) => {
        if (input.value !== '') return false;

        for (let t = 1; t < curent; t++) {
            const prevInput = document.querySelector<HTMLInputElement>(`#guess-${t}-letter-${index + 1}`);
            if (prevInput && prevInput.classList.contains('bg-win')) {
                return false;
            }
        }

        return true;
    });

    if (validInputsForHint.length === 0) return;

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
    if (!randomInput) return;

    const indexToFill = enabledInputs.indexOf(randomInput);

    if (indexToFill !== -1 && guessToWord[indexToFill]) {
        randomInput.value = guessToWord[indexToFill].toUpperCase();
        randomInput.readOnly = true;
        // تم التعديل هنا: نحفظ الحرف عشان يظهر تلقائي في المحاولة الجاية
        hintedLetters[indexToFill] = guessToWord[indexToFill]!;
    }
}

function setRoundIndicatorEnabled(enabled: boolean) {
    if (!roundIndicator) return;
    roundIndicator.disabled = !enabled;
    roundIndicator.className = enabled
        ? `${ROUND_INDICATOR_BASE} cursor-pointer active:border-b-2 active:translate-y-0.5`
        : `${ROUND_INDICATOR_BASE} opacity-40 cursor-not-allowed`;
}

function updateRoundIndicator() {
    if (!roundIndicator) return;
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
    } else {
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
    }
}

roundIndicator?.addEventListener('click', advanceRound);

// تم التعديل هنا: إعادة تشغيل لعبة جديدة من شاشة النتائج
function restartGame(): void {
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
        document.getElementById('games-promo-container')?.classList.add('hidden');
        document.getElementById('theme-toggle')?.classList.add('hidden');
        restartGame();
    },
    onBackHome: () => {
        resetResults();
        currentRound = 1;
        roundResults.length = 0;
        document.getElementById('games-promo-container')?.classList.remove('hidden');
        document.getElementById('theme-toggle')?.classList.remove('hidden');
    },
});

// npx @tailwindcss/cli -i ./style.css -o ./output.css --watch
// لا تحذف الكود الذي فوقي

initSettingsFilter();
initKeyboard();
initAchievements();

initUI(
    () => {
        restartGame();
    },
    () => {
        resetResults();
        currentRound = 1;
        roundResults.length = 0;
    }
);