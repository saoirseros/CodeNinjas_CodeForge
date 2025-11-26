// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDRgC9tMKgybDKvH5Kj3ztiPnU_QA9zbiU",
  authDomain: "campus-connect-hack.firebaseapp.com",
  databaseURL: "https://campus-connect-hack-default-rtdb.firebaseio.com",
  projectId: "campus-connect-hack",
  storageBucket: "campus-connect-hack.firebasestorage.app",
  messagingSenderId: "497826115749",
  appId: "1:497826115749:web:7738da2d98270e51e29d4c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export default app;
