import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBWNNwjjh6ILVFUgCsMQ2VikZeobs8zU8w",
    authDomain: "gas-agency-1d362.firebaseapp.com",
    projectId: "gas-agency-1d362",
    storageBucket: "gas-agency-1d362.firebasestorage.app",
    messagingSenderId: "826982092675",
    appId: "1:826982092675:web:5313a3d73d6dee066130b6",
    measurementId: "G-LR16XFN0HL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin Signup
document.getElementById("signupBtn")?.addEventListener("click", async () => {
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Store admin role in Firestore
        await setDoc(doc(db, "admins", user.uid), {
            email: user.email,
            role: "admin"
        });

        alert("Admin account created successfully!");
        window.location.href = "adminLogin.html"; // Redirect to login page
    } catch (error) {
        alert(error.message);
    }
});

// Admin Login
document.getElementById("loginBtn")?.addEventListener("click", async () => {
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if user is admin
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists() && adminSnap.data().role === "admin") {
            alert("Admin login successful!");
            window.location.href = "admin.html"; // Redirect to Admin Dashboard
        } else {
            alert("You are not an admin!");
        }
    } catch (error) {
        alert(error.message);
    }
});
