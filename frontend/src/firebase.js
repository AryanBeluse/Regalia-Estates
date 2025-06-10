// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "real-estate-auth-5559e.firebaseapp.com",
    projectId: "real-estate-auth-5559e",
    storageBucket: "real-estate-auth-5559e.firebasestorage.app",
    messagingSenderId: "817402083589",
    appId: "1:817402083589:web:4c45422bd5777afd52df6c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);