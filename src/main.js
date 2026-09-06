var _c;
{
    let gameName = 'GUESS THE WORD';
    document.title = gameName;
    const gameHeader = document.querySelector(".game-header");
    if (gameHeader)
        gameHeader.innerHTML = gameName;
    let gameStarted = false;
    function setupSPA() {
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
                generateInput();
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
    // my-var-in-this-project
    const numberOfTries = 6;
    // تم التعديل بواسطة صديق (تغيير المتغير ليكون ديناميكياً بدلاً من قيمة ثابته)
    let numberOfLetter = 6;
    let numberOfHints = 2;
    let curent = 1;
    // word suction
    let guessToWord = '';
    const messageErea = document.querySelector('.massege');
    const animeHeroes = [
        "Naruto",
        "Sasuke",
        "Ichigo",
        "Edward",
        "Killua",
        "Megumi",
        "midorya",
        "Josuke"
    ];
    const randomHero = (_c = animeHeroes[Math.floor(Math.random() * animeHeroes.length)]) !== null && _c !== void 0 ? _c : '';
    guessToWord = randomHero.toLowerCase();
    // تم التعديل بواسطة صديق (جعل عدد الخانات والأحرف يعتمد على طول الكلمة المختارة عشوائياً)
    numberOfLetter = guessToWord.length;
    // Manage check :-
    const checkButton = document.getElementById('Check');
    checkButton === null || checkButton === void 0 ? void 0 : checkButton.addEventListener('click', handelCheck);
    // Manage Hints :-
    const hintButton = document.getElementById('hint');
    const hintCountElement = document.querySelector('#hint span');
    if (hintCountElement) {
        hintCountElement.innerHTML = String(numberOfHints);
    }
    hintButton === null || hintButton === void 0 ? void 0 : hintButton.addEventListener('click', handelHints);
    function generateInput() {
        var _c;
        const inputsContener = document.getElementsByClassName("inputs");
        // main-div
        for (let i = 1; i <= numberOfTries; i++) {
            const div = document.createElement('div');
            div.className = `try-${i} mb-5 flex items-center justify-center`;
            div.innerHTML = `<span class='size-10'>Try ${i}<span/>`;
            if (i !== 1) {
                div.className = `try-${i} disabled opacity-50 pointer-events-none mb-5 flex items-center justify-center`;
            }
            // create inputs
            for (let j = 1; j <= numberOfLetter; j++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'input mx-2.5 my-0 h-15 w-15 text-center size-12.5 caret-[#333] bg-white border-b-2 border-b-black focus:outline-[#ccc] focus:outline-1.5 focus:border-none';
                input.id = `guess-${i}-letter-${j}`;
                input.setAttribute('maxlength', '1');
                div.appendChild(input);
            }
            (_c = inputsContener[0]) === null || _c === void 0 ? void 0 : _c.appendChild(div);
        }
        // Disabled all inputs esxpet the first line
        const inputeInDisabledMode = document.querySelectorAll('.disabled input');
        inputeInDisabledMode.forEach((input) => (input.disabled = true));
        const inputs = document.querySelectorAll('.input');
        // make all word to Uppercase & make tou can switsh to left and right with keybord
        inputs.forEach((input, index) => {
            // make a word to UpperCase
            input.addEventListener("input", () => {
                input.value = input.value.toUpperCase();
                const nextInput = inputs[index + 1];
                if (nextInput)
                    nextInput.focus();
            });
            input.addEventListener("keydown", function (event) {
                //  save the index in a var to use it in futshar fetshar
                const currentIndex = Array.from(inputs).indexOf(input); // Or this
                // to go right with keyboarde key
                if (event.key === "ArrowRight") {
                    const nextInput = currentIndex + 1;
                    if (nextInput < inputs.length)
                        inputs[nextInput].focus();
                }
                // to go left with keyboarde key
                if (event.key === "ArrowLeft") {
                    const prevInput = currentIndex - 1;
                    if (prevInput >= 0)
                        inputs[prevInput].focus();
                }
                // delete letters from left to right or from right to left 
                if (event.key === "Backspace") {
                    event.preventDefault(); // منع السلوك الافتراضي لضمان الدقة
                    if (input.value !== "") {
                        // إذا كان الحقل الحالي فيه حرف: احذفه وابْقَ في نفس الحقل
                        input.value = "";
                    }
                    else if (currentIndex > 0) {
                        // إذا كان الحقل فارغاً: ارجع للحقل السابق واحذف ما فيه وركّز عليه
                        const prevInput = inputs[currentIndex - 1];
                        if (prevInput) {
                            prevInput.value = "";
                            prevInput.focus();
                        }
                    }
                }
                // تنفيذ التحقق عند الضغط على Enter
                if (event.key === "Enter") {
                    event.preventDefault();
                    handelCheck();
                }
            });
        });
    }
    console.log(guessToWord);
    // the function of check : -
    // the function of check : -
    function handelCheck() {
        var _a, _b;
        let success = true;
        // تم التعديل بواسطة صديق
        const currentInputs = [];
        const targetWordLetters = guessToWord.split('');
        const letterCounts = {};
        // تم التعديل بواسطة صديق
        for (const letter of targetWordLetters) {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }
        // تم التعديل بواسطة صديق
        for (let i = 1; i <= numberOfLetter; i++) {
            const inputFiled = document.querySelector(`#guess-${curent}-letter-${i}`);
            const val = inputFiled && inputFiled.value ? inputFiled.value.toLowerCase() : '';
            currentInputs.push({
                element: inputFiled,
                letter: val,
                status: ''
            });
        }
        // الكلاسات الأساسية للحفاظ على حجم الحقل وشكل الخط والتوسط
        const baseClasses = "input mx-2.5 my-0 h-15 w-15 size-12.5 text-center font-bold text-xl uppercase text-white caret-[#333] border-none transition-colors duration-300";
        // تم التعديل بواسطة صديق
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
        // تم التعديل بواسطة صديق
        currentInputs.forEach((item) => {
            var _c;
            if (!item.element)
                return;
            if (item.status === 'win') {
                item.element.className = `${baseClasses} bg-win`;
                return;
            }
            const letter = item.letter;
            const availableCount = (_c = letterCounts[letter]) !== null && _c !== void 0 ? _c : 0;
            if (letter !== '' && availableCount > 0) {
                item.element.className = `${baseClasses} bg-mud`;
                letterCounts[letter] = availableCount - 1;
            }
            else {
                item.element.className = `${baseClasses} bg-lose`;
            }
        });
        if (success) {
            if (messageErea) {
                messageErea.innerHTML = `you win and the word is <span class="block mx-auto text-3xl mt-2.5 text-center font-bold capitalize text-win">${guessToWord}</span>`;
                if (numberOfHints === 2) {
                    messageErea.innerHTML = `Congratulations You Didn't Use Hints 🤯!<br><br> And You Win The Word is <span class="block mx-auto text-3xl mt-2.5 text-center font-bold capitalize text-win">${guessToWord}</span>`;
                }
            }
            // جلب صفوف المحاولات بعد إنشائها في الـ DOM وتظليلها
            const allTriesDivs = document.querySelectorAll('.inputs > div');
            allTriesDivs.forEach((div) => {
                div.classList.add('disabled', 'opacity-50', 'pointer-events-none');
            });
            // تعطيل جميع الـ Inputs لمنع الكتابة
            const allInputs = document.querySelectorAll('.input');
            allInputs.forEach((input) => {
                // تم التعديل بواسطة صديق
                input.disabled = true;
            });
            // تعطيل زر Check
            if (checkButton) {
                checkButton.setAttribute('disabled', 'true');
                checkButton.classList.add('opacity-50', 'pointer-events-none');
            }
            // تعطيل زر hint
            if (hintButton) {
                hintButton.setAttribute('disabled', 'true');
                hintButton.classList.add('opacity-50', 'pointer-events-none');
            }
        }
        else {
            (_a = document.querySelector(`.try-${curent}`)) === null || _a === void 0 ? void 0 : _a.classList.add('disabled', 'opacity-50', 'pointer-events-none');
            const curentTry = document.querySelectorAll(`.try-${curent} input`);
            // تم التعديل بواسطة صديق
            curentTry.forEach((input) => { input.disabled = true; });
            curent++;
            const nextCurentTry = document.querySelectorAll(`.try-${curent} input`);
            // تم التعديل بواسطة صديق
            nextCurentTry.forEach((input) => { input.disabled = false; });
            const el = document.querySelector(`.try-${curent}`);
            if (el) {
                (_b = document.querySelector(`.try-${curent}`)) === null || _b === void 0 ? void 0 : _b.classList.remove('disabled', 'opacity-50', 'pointer-events-none');
                // تم التعديل بواسطة صديق
                const firstNextInput = el.querySelector('input');
                if (firstNextInput)
                    firstNextInput.focus();
            }
            else {
                // تعطيل زر Check
                if (checkButton) {
                    checkButton.setAttribute('disabled', 'true');
                    checkButton.classList.add('opacity-50', 'pointer-events-none');
                }
                // تعطيل زر hint
                if (hintButton) {
                    hintButton.setAttribute('disabled', 'true');
                    hintButton.classList.add('opacity-50', 'pointer-events-none');
                }
                if (messageErea) {
                    messageErea.innerHTML = `😔 U Lose the word it was <span class="block mx-auto text-3xl mt-2.5 text-center font-bold capitalize text-lose">${guessToWord}</span>`;
                }
            }
        }
    }
    function handelHints() {
        if (numberOfHints <= 0)
            return;
        // 1. جلب المدخلات المتاحة في المحاولة الحالية
        const enabledInputs = Array.from(document.querySelectorAll(`.try-${curent} input:not([disabled])`));
        // 2. فلترة المدخلات: فارغة + لم يتم تخمين موقعها بحرف صحيح في المحاولات السابقة
        const validInputsForHint = enabledInputs.filter((input, index) => {
            // أن يكون الحقل فارغاً في المحاولة الحالية
            if (input.value !== '')
                return false;
            // التاكد من أن نفس الموقع (index) لم يحصل على bg-win في المحاولات السابقة
            for (let t = 1; t < curent; t++) {
                const prevInput = document.querySelector(`#guess-${t}-letter-${index + 1}`);
                if (prevInput && prevInput.classList.contains('bg-win')) {
                    return false; // الحرف مكشوف سابقاً في هذا الموقع، يتم استبعاده من التلميح
                }
            }
            return true;
        });
        // إذا كانت كل الحقول المتبقية تم كشفها سابقاً أو ممتلئة، لا تنفذ التلميح
        if (validInputsForHint.length === 0)
            return;
        // 3. خصم التلميح وتحديث العداد
        numberOfHints--;
        if (hintCountElement) {
            hintCountElement.innerHTML = String(numberOfHints);
        }
        if (numberOfHints === 0 && hintButton) {
            hintButton.disabled = true;
            hintButton.classList.add('opacity-40', 'cursor-no-drop');
            hintButton.classList.remove('active:bg-sky-900', 'active:scale-93');
        }
        // 4. اختيار حقل عشوائي من الحقول المفلترة فقط
        const randomIndex = Math.floor(Math.random() * validInputsForHint.length);
        const randomInput = validInputsForHint[randomIndex];
        if (!randomInput)
            return;
        const indexToFill = enabledInputs.indexOf(randomInput);
        if (indexToFill !== -1 && guessToWord[indexToFill]) {
            randomInput.value = guessToWord[indexToFill].toUpperCase();
        }
    }
    function initApp() {
        setupSPA();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    }
    else {
        initApp();
    }
    // npx @tailwindcss/cli -i ./src/style.css -o ./dist/output.css --watch
}
