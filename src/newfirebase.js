import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Used for Login/Signup/Logout
import { getFirestore } from "firebase/firestore"; // Used for Events, Marketplace, Lost & Found
import { getDatabase } from "firebase/database"; // Used for Realtime DB (Chatroom)

// IMPORTANT: Replace these dummy strings with your actual Firebase project config values
// Use the real values you identified earlier.
const firebaseConfig = {
  apiKey: "AIzaSyDRgC9tMKgybDKvH5Kj3ztiPnU_QA9zbiU", // REPLACE THIS WITH YOUR REAL KEY
  authDomain: "campus-connect-hack.firebaseapp.com",
  databaseURL: "https://campus-connect-hack-default-rtdb.firebaseio.com", // REPLACE THIS WITH YOUR REAL RTDB URL
  projectId: "campus-connect-hack",
  storageBucket: "campus-connect-hack.firebasestorage.app",
  messagingSenderId: "497826115749",
  appId: "1:497826115749:web:7738da2d98270e51e29d4c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services and Export
export const auth = getAuth(app); // Exported for use in Login.jsx and Navbar.jsx
export const db = getFirestore(app); // Exported for use in Marketplace, Home, Clubs, etc.
export const rtdb = getDatabase(app); // Exported for use in Chatroom.jsx
