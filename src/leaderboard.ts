// src/leaderboard.ts
// Reads/writes each player's full progress doc in Firestore, so it stays
// in sync across every device/browser they log in from.

import {
  getFirestore, doc, setDoc, getDoc, collection, query,
  orderBy, limit, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getCurrentUser } from "./firebaseAuth.js";
import type { Stats } from "./achievements.js";

const db = getFirestore(window.firebaseApp);

// الشكل الكامل للتقدم المتخزن في Firestore — نفس بيانات achievements.ts
// بالظبط، زائد اليوزرنيم عشان الـ leaderboard يقدر يعرضه من غير ما يعمل lookup تاني.
// unlockedCount متخزن كـ رقم منفصل (مش بس unlockedIds.length) عشان Firestore
// يقدر يرتب/يفلتر بيه مباشرة (مينفعش تعمل orderBy على طول array).
export interface CloudProgress extends Stats {
  username: string;
  unlockedIds: string[];
  unlockedCount: number;
}

export interface LeaderboardEntry extends CloudProgress {
  uid: string;
}

// Call this right after a round finishes (or right after showResultsScreen()).
// Pass the *current full* stats + unlocked achievement ids from achievements.ts —
// مش بس رقم الجولة، عشان الحساب يتزامن كامل مع أي جهاز تاني.
export async function saveMyResults(stats: Stats, unlockedIds: string[]): Promise<void> {
  const user = getCurrentUser();
  if (!user) return; // not logged in — nothing to save, game still works fine locally

  const ref = doc(db, "players", user.uid);
  const payload: Omit<CloudProgress, never> = {
    username: user.displayName ?? "Player",
    ...stats,
    unlockedIds,
    unlockedCount: unlockedIds.length,
  };
  await setDoc(ref, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export async function loadLeaderboard(topN = 10): Promise<LeaderboardEntry[]> {
  const q = query(collection(db, "players"), orderBy("totalRounds", "desc"), limit(topN));
  const snap = await getDocs(q);
  return snap.docs.map((d: { id: string; data: () => CloudProgress }) => ({
    uid: d.id,
    ...d.data(),
  }));
}

// ترتيب التوب 5 حسب الجوائز (unlockedCount) الأول، ولو الجوائز متساوية يبقى
// الفرق في عدد الراوندات (الأكتر لعب بيتقدم). محتاج composite index في
// Firestore على players: unlockedCount (desc) + totalRounds (desc) — لو
// الاستعلام فشل، Firestore هيديك لينك في الـ console error يعمل الـ index تلقائي.
export async function loadTopByAchievements(topN = 5): Promise<LeaderboardEntry[]> {
  const q = query(
    collection(db, "players"),
    orderBy("unlockedCount", "desc"),
    orderBy("totalRounds", "desc"),
    limit(topN)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d: { id: string; data: () => CloudProgress }) => ({
    uid: d.id,
    ...d.data(),
  }));
}

// بترجع تقدم المستخدم الحالي من Firestore، أو null لو حساب جديد لسه معندوش بيانات.
export async function getMyStats(): Promise<CloudProgress | null> {
  const user = getCurrentUser();
  if (!user) return null;
  const snap = await getDoc(doc(db, "players", user.uid));
  return snap.exists() ? (snap.data() as CloudProgress) : null;
}
