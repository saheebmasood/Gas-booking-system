// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWNNwjjh6ILVFUgCsMQ2VikZeobs8zU8w",
    authDomain: "gas-agency-1d362.firebaseapp.com",
    projectId: "gas-agency-1d362",
    storageBucket: "gas-agency-1d362.firebasestorage.app",
    messagingSenderId: "826982092675",
    appId: "1:826982092675:web:5313a3d73d6dee066130b6",
    measurementId: "G-LR16XFN0HL"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
