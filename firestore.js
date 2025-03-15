import { db, auth } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Book a Gas Cylinder
const bookCylinder = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to book a cylinder.");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      userId: user.uid,
      email: user.email,
      timestamp: new Date(),
      status: "Pending", // Admin will approve or reject
    });

    alert("Booking successful! Your request is pending approval.");
    loadBookings(); // Refresh booking history
  } catch (error) {
    console.error("Error booking cylinder:", error);
    alert("Failed to book a cylinder.");
  }
};

// Load User Booking History
const loadBookings = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const bookingHistory = document.getElementById("booking-history");
  bookingHistory.innerHTML = "<h3>Booking History</h3>";

  const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    bookingHistory.innerHTML += `<p>${data.timestamp.toDate().toLocaleString()} - ${data.status}</p>`;
  });
};

// Export Functions
export { bookCylinder, loadBookings };
