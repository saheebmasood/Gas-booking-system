import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Config
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

// Logout Admin
document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "adminLogin.html"; // Redirect to login
});

// Fetch Bookings and Display in Table
const bookingList = document.getElementById("bookingList");

async function loadBookings() {
    try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        bookingList.innerHTML = ""; // Clear previous data

        querySnapshot.forEach((docSnapshot) => {
            const booking = docSnapshot.data();
            
            // Check if userEmail and date exist
            const userEmail = booking.email || "Unknown User";
            let bookingDate = "N/A";
            if (booking.timestamp) {
                bookingDate = new Date(booking.timestamp.seconds * 1000).toLocaleString();
            }
            const bookingStatus = booking.status || "Pending";

            // Create table row
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${userEmail}</td>
                <td>${bookingDate}</td>
                <td>${bookingStatus}</td>
                <td>
                    <button class="Pending" data-id="${docSnapshot.id}">⏳ Pending</button>
                    <button class="approve" data-id="${docSnapshot.id}">🚚 Approve</button>
                    <button class="reject" data-id="${docSnapshot.id}">❌ Reject</button>
                    <button class="Delivered" data-id="${docSnapshot.id}">✅ Delivered</button>
                </td>
            `;
            bookingList.appendChild(row);
        });

        // Attach event listeners for Approve & Reject buttons
        document.querySelectorAll(".Delivered").forEach((button) => {
            button.addEventListener("click", async (event) => {
                const bookingId = event.target.dataset.id;
                await updateDoc(doc(db, "bookings", bookingId), { status: "✅Delivered" });
                loadBookings(); // Refresh data
            });
        });

        document.querySelectorAll(".Pending").forEach((button) => {
            button.addEventListener("click", async (event) => {
                const bookingId = event.target.dataset.id;
                await updateDoc(doc(db, "bookings", bookingId), { status: "Pending" });
                loadBookings(); // Refresh data
            });
        });

        document.querySelectorAll(".approve").forEach((button) => {
            button.addEventListener("click", async (event) => {
                const bookingId = event.target.dataset.id;
                await updateDoc(doc(db, "bookings", bookingId), { status: "🚚Approved" });
                loadBookings(); // Refresh data
            });
        });

        document.querySelectorAll(".reject").forEach((button) => {
            button.addEventListener("click", async (event) => {
                const bookingId = event.target.dataset.id;
                await updateDoc(doc(db, "bookings", bookingId), { status: "Rejected" });
                loadBookings(); // Refresh data
            });
        });

    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}

// Load bookings on page load
loadBookings();
