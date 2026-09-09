// فيديو الاحتفال/الخسارة الكاملة — يظهر بس لو كل جولات الجلسة نتيجتها واحدة
const WIN_VIDEO_COUNT = 3; // عدد فيديوهات الفوز
const LOSE_VIDEO_COUNT = 3; // عدد فيديوهات الخسارة
function pickRandomVideo(kind) {
    const count = kind === 'win' ? WIN_VIDEO_COUNT : LOSE_VIDEO_COUNT;
    const index = Math.floor(Math.random() * count) + 1;
    return `./videos/${kind}/${kind}${index}.mp4`;
}
/**
 * تتنادى من results.ts بعد ما تعرف correctCount, wrongCount, totalRounds.
 * بتشتغل بس لو كل الجولات صح أو كل الجولات غلط.
 */
export function maybeShowPerfectVideo(correctCount, wrongCount, totalRounds) {
    const overlay = document.getElementById('perfect-video-overlay');
    const video = document.getElementById('perfect-video');
    if (!overlay || !video || totalRounds <= 0)
        return;
    let kind = null;
    if (correctCount === totalRounds)
        kind = 'win';
    else if (wrongCount === totalRounds)
        kind = 'lose';
    if (!kind)
        return; // نتيجة مختلطة، مفيش فيديو
    // تحميل كسول: الـ src بيتحدد دلوقتي بس، مش من أول ما الصفحة تفتح
    video.src = pickRandomVideo(kind);
    video.load();
    overlay.classList.remove('hidden');
    // إجبار reflow قبل الفيد إن عشان الترانزيشن يشتغل
    void overlay.offsetWidth;
    overlay.classList.add('opacity-100');
    overlay.classList.remove('opacity-0');
    video.play().catch(() => { });
    const hideOverlay = () => {
        overlay.classList.add('opacity-0');
        overlay.classList.remove('opacity-100');
        setTimeout(() => {
            overlay.classList.add('hidden');
            video.pause();
            video.removeAttribute('src');
            video.load();
        }, 500); // نفس مدة الـ transition
    };
    video.addEventListener('ended', hideOverlay, { once: true });
    // إغلاق يدوي لو ضغط على الخلفية
    overlay.addEventListener('click', hideOverlay, { once: true });
}
