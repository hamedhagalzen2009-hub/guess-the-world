// src/firebaseAuth.ts
// Wraps Firebase Authentication so the rest of the app only ever deals with
// "username + password" — Firebase itself still needs an email under the hood,
// so we fabricate one from the username.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
const auth = getAuth(window.firebaseApp);
// Firebase requires an email; we build one that will never collide with a
// real address and never gets shown to the user anywhere.
function usernameToFakeEmail(username) {
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
    return `${clean}@guess-the-world-players.app`;
}
function friendlyError(code) {
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
export function signUp(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = usernameToFakeEmail(username);
            const cred = yield createUserWithEmailAndPassword(auth, email, password);
            // store the real, human-readable username on the profile
            yield updateProfile(cred.user, { displayName: username.trim() });
            return { ok: true, user: cred.user };
        }
        catch (err) {
            return { ok: false, errorCode: err.code, message: friendlyError(err.code) };
        }
    });
}
const googleProvider = new GoogleAuthProvider();
export function signInWithGoogle() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cred = yield signInWithPopup(auth, googleProvider);
            return { ok: true, user: cred.user };
        }
        catch (err) {
            return { ok: false, errorCode: err.code, message: friendlyError(err.code) };
        }
    });
}
export function logIn(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = usernameToFakeEmail(username);
            const cred = yield signInWithEmailAndPassword(auth, email, password);
            return { ok: true, user: cred.user };
        }
        catch (err) {
            return { ok: false, errorCode: err.code, message: friendlyError(err.code) };
        }
    });
}
export function logOut() {
    return __awaiter(this, void 0, void 0, function* () {
        yield signOut(auth);
    });
}
export function getCurrentUser() {
    return auth.currentUser;
}
export function onAuthChange(callback) {
    onAuthStateChanged(auth, callback);
}
export { auth };
