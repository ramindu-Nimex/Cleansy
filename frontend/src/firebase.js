// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cleansy-ssd.firebaseapp.com",
  projectId: "cleansy-ssd",
  storageBucket: "cleansy-ssd.firebasestorage.app",
  messagingSenderId: "406078280471",
  appId: "1:406078280471:web:bcbd0a7d71b47f66b39d52",
  measurementId: "G-5S7NBP3KPQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);