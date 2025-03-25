import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Signup Function
const signup = async (name, address, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name,
            address,
            email,
            userId: user.uid
        });

        alert("Signup successful! Redirecting to login...");
        window.location.href = "login.html";
    } catch (error) {
        alert(error.message);
    }
};

// Login Function
const login = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Login successful! Redirecting to dashboard...");
            window.location.href = "dashboard.html";
        })
        .catch(error => alert(error.message));
};

// Logout Function
const logout = () => {
    signOut(auth)
        .then(() => {
            alert("Logged out successfully!");
            window.location.href = "login.html";
        })
        .catch(error => alert(error.message));
};

export { signup, login, logout };
