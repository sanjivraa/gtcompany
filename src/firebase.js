import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4w9H4pkX2JvrpDoB0Z1GC4VuSooiwRaw",
  authDomain: "guhanix-technologies.firebaseapp.com",
  projectId: "guhanix-technologies",
  storageBucket: "guhanix-technologies.firebasestorage.app",
  messagingSenderId: "121390371681",
  appId: "1:121390371681:web:2d3316c1e4170459bfab20",
  measurementId: "G-J9EN7RCVMQ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
