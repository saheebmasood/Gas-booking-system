import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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

// Show Admin Email
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("admin-email").textContent = user.email;
    } else {
        window.location.href = "adminLogin.html"; // Redirect to login
    }
});

// Logout Admin
document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "adminLogin.html"; // Redirect to login
});

// Gas Price Elements
const gasPriceInput = document.getElementById("gasPriceInput");
const setPriceBtn = document.getElementById("setPriceBtn");
const currentGasPrice = document.getElementById("currentGasPrice");

// Load Gas Price from Firestore
async function loadGasPrice() {
    try {
        const priceDoc = await getDoc(doc(db, "settings", "gas_price"));
        if (priceDoc.exists()) {
            currentGasPrice.textContent = `₹${priceDoc.data().price}`;
        } else {
            currentGasPrice.textContent = "Not Set";
        }
    } catch (error) {
        console.error("Error fetching gas price:", error);
    }
}

// Admin Sets Gas Price
setPriceBtn.addEventListener("click", async () => {
    const price = parseFloat(gasPriceInput.value);
    if (!price || price <= 0) {
        alert("Please enter a valid gas price!");
        return;
    }

    try {
        await setDoc(doc(db, "settings", "gas_price"), { price });
        alert(`Gas price set to ₹${price}`);
        loadGasPrice(); // Refresh price display
    } catch (error) {
        console.error("Error updating gas price:", error);
    }
});

// Fetch Bookings and Display in Table
const bookingList = document.getElementById("bookingList");

async function loadBookings() {
    try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        bookingList.innerHTML = ""; // Clear previous data

        // Fetch gas price
        const priceDoc = await getDoc(doc(db, "settings", "gas_price"));
        const gasPrice = priceDoc.exists() ? priceDoc.data().price : "Not Set";

        querySnapshot.forEach(async (docSnapshot) => {
            const booking = docSnapshot.data();
            const userRef = doc(db, "users", booking.userId);
            const userDoc = await getDoc(userRef);

            const userName = userDoc.exists() ? userDoc.data().name : "Unknown";
            const userAddress = userDoc.exists() ? userDoc.data().address : "N/A";
            const userEmail = booking.email || "Unknown User";

            let bookingDate = "N/A";
            if (booking.timestamp) {
                bookingDate = new Date(booking.timestamp.seconds * 1000).toLocaleString();
            }
            const bookingStatus = booking.status || "Pending";
            const bookingId = docSnapshot.id;

            // Create table row
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${userName}</td>
                <td>${userEmail}</td>
                <td>${userAddress}</td>
                <td>${bookingDate}</td>
                <td>₹${gasPrice}</td>
                <td class="status">${bookingStatus}</td>
                <td>
                    <button class="status-btn" data-id="${bookingId}" data-status="Pending">⏳ Pending</button>
                    <button class="status-btn" data-id="${bookingId}" data-status="Approved">🚚 Approve</button>
                    <button class="status-btn" data-id="${bookingId}" data-status="Rejected">❌ Reject</button>
                    <button class="status-btn" data-id="${bookingId}" data-status="Delivered">✅ Delivered</button>
                </td>
            `;
            bookingList.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}

// Event Delegation: Handle All Status Change Clicks
bookingList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("status-btn")) {
        const bookingId = event.target.dataset.id;
        const newStatus = event.target.dataset.status;

        try {
            await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });

            // Update UI Without Reloading
            const row = event.target.closest("tr");
            row.querySelector(".status").textContent = newStatus;

            alert(`Booking status updated to: ${newStatus}`);
        } catch (error) {
            console.error("Error updating booking status:", error);
        }
    }
});

// Load Everything on Page Load
loadGasPrice();
loadBookings();
