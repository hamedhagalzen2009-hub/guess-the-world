// src/firebaseAuth.ts
// Wraps Firebase Authentication so the rest of the app only ever deals with
// "username + password" — Firebase itself still needs an email under the hood,
// so we fabricate one from the username.

import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile, type User } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth(window.firebaseApp);

// Firebase requires an email; we build one that will never collide with a
// real address and never gets shown to the user anywhere.
function usernameToFakeEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
  return `${clean}@guess-the-world-players.app`;
}

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; errorCode: string; message: string };

function friendlyError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "اليوزر نيم ده مستخدم بالفعل، جرّب اسم تاني.";
    case "auth/weak-password":
      return "الباسورد لازم يكون 6 حروف/أرقام على الأقل.";
    case "auth/invalid-email":
      return "اليوزر نيم فيه حروف مش مسموحة، جرّب اسم أبسط.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "الباسورد غلط.";
    case "auth/user-not-found":
      return "مفيش حساب بالاسم ده.";
    case "auth/popup-closed-by-user":
      return "اتقفلت النافذة قبل ما تكمل الدخول.";
    default:
      return "حصل خطأ، جرّب تاني.";
  }
}

export async function signUp(username: string, password: string): Promise<AuthResult> {
  try {
    const email = usernameToFakeEmail(username);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // store the real, human-readable username on the profile
    await updateProfile(cred.user, { displayName: username.trim() });
    return { ok: true, user: cred.user };
  } catch (err: any) {
    return { ok: false, errorCode: err.code, message: friendlyError(err.code) };
  }
}

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return { ok: true, user: cred.user };
  } catch (err: any) {
    return { ok: false, errorCode: err.code, message: friendlyError(err.code) };
  }
}

export async function logIn(username: string, password: string): Promise<AuthResult> {
  try {
    const email = usernameToFakeEmail(username);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { ok: true, user: cred.user };
  } catch (err: any) {
    return { ok: false, errorCode: err.code, message: friendlyError(err.code) };
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function onAuthChange(callback: (user: User | null) => void): void {
  onAuthStateChanged(auth, callback);
}

export { auth };
