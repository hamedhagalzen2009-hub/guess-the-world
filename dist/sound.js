// 1. إعداد الصوت
const bgMusic = new Audio('./assets/bg-music.mp3'); // مسار ملف الصوت الخاص بك
bgMusic.loop = true;
bgMusic.volume = 0.3;
let isMusicEnabled = true;
// 2. مسارات الأيقونات (صوت شغال / مكتوم)
const iconVolumeOn = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
const iconVolumeOff = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.84 21 13.47 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H4c-.55 0-1 .45-1 1v5.86c0 .55.45 1 1 1h3.07l4.72 4.72c.63.63 1.71.18 1.71-.71v-5.26l4.78 4.78c-.87.53-1.83.92-2.85 1.14v2.06c1.56-.3 2.99-.99 4.2-1.95l2.09 2.09L21 20.73 4.27 3zM12 4.06c0-.58-.52-.96-1.04-.73-.13.06-.25.15-.36.26L8.07 6.12l4.93 4.93V4.06z"/>`;
// 3. جلب العناصر
const toggleMusicBtn = document.getElementById('toggle-music');
const musicIcon = document.getElementById('music-icon');
const musicText = document.getElementById('music-text');
const btnStart = document.getElementById('btn-start');
// تشغيل الصوت عند الضغط على بدء اللعبة لتجاوز قيود المتصفح
btnStart === null || btnStart === void 0 ? void 0 : btnStart.addEventListener('click', () => {
    if (isMusicEnabled && bgMusic.paused) {
        bgMusic.play().catch((err) => console.log("Autoplay prevented:", err));
    }
});
// التحكم في الزر من الإعدادات
toggleMusicBtn === null || toggleMusicBtn === void 0 ? void 0 : toggleMusicBtn.addEventListener('click', () => {
    isMusicEnabled = !isMusicEnabled;
    if (isMusicEnabled) {
        bgMusic.play();
        if (musicText)
            musicText.textContent = 'ON';
        if (musicIcon)
            musicIcon.innerHTML = iconVolumeOn;
        toggleMusicBtn.classList.remove('bg-rose-600');
        toggleMusicBtn.classList.add('bg-emerald-600');
    }
    else {
        bgMusic.pause();
        if (musicText)
            musicText.textContent = 'OFF';
        if (musicIcon)
            musicIcon.innerHTML = iconVolumeOff;
        toggleMusicBtn.classList.remove('bg-emerald-600');
        toggleMusicBtn.classList.add('bg-rose-600');
    }
});
export {};
