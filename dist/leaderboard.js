// src/leaderboard.ts
// Reads/writes each player's full progress doc in Firestore, so it stays
// in sync across every device/browser they log in from.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getCurrentUser } from "./firebaseAuth.js";
const db = getFirestore(window.firebaseApp);
// Call this right after a round finishes (or right after showResultsScreen()).
// Pass the *current full* stats + unlocked achievement ids from achievements.ts —
// مش بس رقم الجولة، عشان الحساب يتزامن كامل مع أي جهاز تاني.
export function saveMyResults(stats, unlockedIds) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user = getCurrentUser();
        if (!user)
            return; // not logged in — nothing to save, game still works fine locally
        const ref = doc(db, "players", user.uid);
        const payload = Object.assign(Object.assign({ username: (_a = user.displayName) !== null && _a !== void 0 ? _a : "Player" }, stats), { unlockedIds, unlockedCount: unlockedIds.length });
        yield setDoc(ref, Object.assign(Object.assign({}, payload), { updatedAt: serverTimestamp() }), { merge: true });
    });
}
export function loadLeaderboard() {
    return __awaiter(this, arguments, void 0, function* (topN = 10) {
        const q = query(collection(db, "players"), orderBy("totalRounds", "desc"), limit(topN));
        const snap = yield getDocs(q);
        return snap.docs.map((d) => (Object.assign({ uid: d.id }, d.data())));
    });
}
// ترتيب التوب 5 حسب الجوائز (unlockedCount) الأول، ولو الجوائز متساوية يبقى
// الفرق في عدد الراوندات (الأكتر لعب بيتقدم). محتاج composite index في
// Firestore على players: unlockedCount (desc) + totalRounds (desc) — لو
// الاستعلام فشل، Firestore هيديك لينك في الـ console error يعمل الـ index تلقائي.
export function loadTopByAchievements() {
    return __awaiter(this, arguments, void 0, function* (topN = 5) {
        const q = query(collection(db, "players"), orderBy("unlockedCount", "desc"), orderBy("totalRounds", "desc"), limit(topN));
        const snap = yield getDocs(q);
        return snap.docs.map((d) => (Object.assign({ uid: d.id }, d.data())));
    });
}
// بترجع تقدم المستخدم الحالي من Firestore، أو null لو حساب جديد لسه معندوش بيانات.
export function getMyStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = getCurrentUser();
        if (!user)
            return null;
        const snap = yield getDoc(doc(db, "players", user.uid));
        return snap.exists() ? snap.data() : null;
    });
}
