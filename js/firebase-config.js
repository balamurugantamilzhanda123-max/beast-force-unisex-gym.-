import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "PASTE_FIREBASE_AUTH_DOMAIN",
  projectId: "PASTE_FIREBASE_PROJECT_ID",
  storageBucket: "PASTE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "PASTE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "PASTE_FIREBASE_APP_ID"
};

export const adminAllowlist = [
  "admin@beastforcegym.com"
];

export const emailJsConfig = {
  publicKey: "PASTE_EMAILJS_PUBLIC_KEY",
  serviceId: "PASTE_EMAILJS_SERVICE_ID",
  subscriptionTemplateId: "PASTE_EMAILJS_SUBSCRIPTION_TEMPLATE_ID",
  promotionTemplateId: "PASTE_EMAILJS_PROMOTION_TEMPLATE_ID"
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PASTE_");
export const isEmailJsConfigured = !emailJsConfig.publicKey.startsWith("PASTE_");

let app;
export const firebase = {};

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  firebase.auth = getAuth(app);
  firebase.db = getFirestore(app);
}

export {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
};
