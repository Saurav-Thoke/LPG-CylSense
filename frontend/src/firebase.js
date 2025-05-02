// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {getMessaging} from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyDGjeafMtIXgYzEJYXdXWMyTaPc_DUhAuQ",
  authDomain: "lpgcycsense.firebaseapp.com",
  projectId: "lpgcycsense",
  storageBucket: "lpgcycsense.firebasestorage.app",
  messagingSenderId: "1092723237666",
  appId: "1:1092723237666:web:f2917fdacc44ea5fcbfb7b",
  measurementId: "G-5PCCDL4TYE",
};

//  Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging=getMessaging(app);
//  Initialize Auth
const auth = getAuth(app);

//  Optional: Example login function
const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, 'email@example.com', 'password');
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName
      })
    });

    const data = await response.json();
    console.log('Backend response:', data);
  } catch (error) {
    console.error('Login error:', error.message);
  }
};

//  Export what you need
export { auth, login,messaging };
