import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDGjeafMtIXgYzEJYXdXWMyTaPc_DUhAuQ",
    authDomain: "lpgcycsense.firebaseapp.com",
    projectId: "lpgcycsense",
    storageBucket: "lpgcycsense.firebasestorage.app",
    messagingSenderId: "1092723237666",
    appId: "1:1092723237666:web:f2917fdacc44ea5fcbfb7b",
    measurementId: "G-5PCCDL4TYE",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
