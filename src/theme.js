(function () {
    var KEY = 'theme';
    var html = document.documentElement;

    if (localStorage.getItem(KEY) === 'dark') {
        html.classList.add('dark');
    }

    function syncToggle() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        btn.setAttribute('aria-pressed', html.classList.contains('dark') ? 'true' : 'false');
    }

    function onReady() {
        syncToggle();
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var isDark = html.classList.toggle('dark');
            localStorage.setItem(KEY, isDark ? 'dark' : 'light');
            syncToggle();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }
})();
// إدارة جرس الألعاب والانيميشن الزمني
(function () {
    // 🔗 رابط موقع ألعابك الأخرى
    var GAMES_URL = 'https://hamedhagalzen2009-hub.github.io/quran-quiz-game1/';

    function initGamesPromo() {
        var bellBtn = document.getElementById('games-bell-btn');
        var toast = document.getElementById('games-toast');
        var closeBtn = document.getElementById('close-toast-btn');
        var autoHideTimer = null;

        if (!bellBtn || !toast) return;

        // دالة تحويل المستخدم للموقع
        function navigateToGames() {
            window.location.href = GAMES_URL;
        }

        // إظهار الرسالة
        function showToast() {
            toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
            toast.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');

            if (autoHideTimer) clearTimeout(autoHideTimer);

            // إخفاء تلقائي بعد 4 ثوانٍ من ظهورها
            autoHideTimer = setTimeout(function () {
                hideToast();
            }, 3000);
        }

        // إخفاء الرسالة
        function hideToast() {
            toast.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
            if (autoHideTimer) clearTimeout(autoHideTimer);
        }

        // عند الضغط على الجرس: يظهر أو يخفي الرسالة (Toggle)
        bellBtn.addEventListener('click', function () {
            var isOpen = toast.classList.contains('opacity-100');
            if (isOpen) {
                hideToast();
            } else {
                showToast();
            }
        });

        // عند الضغط على الرسالة: يحولك للموقع مباشرة
        toast.addEventListener('click', function (e) {
            if (closeBtn && (e.target === closeBtn || closeBtn.contains(e.target))) return;
            navigateToGames();
        });

        // زر إغلاق الرسالة (X)
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                hideToast();
            });
        }

        // --- تسلسل الحركة عند فتح الصفحة ---

        // 1. ظهور الجرس بـ Fade In يستغرق ثانية كاملة (من 0 إلى 1 ثانية)
        setTimeout(function () {
            bellBtn.classList.remove('opacity-0');
            bellBtn.classList.add('opacity-100');
        }, 100);

        // 2. ظهور الرسالة من الثانية 1.0 وتكتمل في الثانية 1.5 (مدة الحركة 0.5 ثانية)
        setTimeout(function () {
            showToast();
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGamesPromo);
    } else {
        initGamesPromo();
    }
})();