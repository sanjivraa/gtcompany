import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4w9H4pkX2JvrpDoB0Z1GC4VuSooiwRaw",
  authDomain: "guhanix-technologies.firebaseapp.com",
  projectId: "guhanix-technologies",
  storageBucket: "guhanix-technologies.firebasestorage.app",
  messagingSenderId: "121390371681",
  appId: "1:121390371681:web:2d3316c1e4170459bfab20",
  measurementId: "G-J9EN7RCVMQ",
};

// Prevent duplicate app initialization (hot reload safe)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
