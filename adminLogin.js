import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Admin credentials (You can store this in Firebase Database for better security)
const adminEmail = "admin@gasagency.com";
const adminPassword = "Admin123";

document.getElementById("adminLoginBtn").addEventListener("click", async () => {
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if admin
        if (email === adminEmail && password === adminPassword) {
            alert("Admin Login Successful!");
            window.location.href = "admin.html"; // Redirect to Admin Panel
        } else {
            alert("Access Denied! You are not an admin.");
        }
    } catch (error) {
        document.getElementById("error-message").innerText = error.message;
    }
});
