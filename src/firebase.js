import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { get, getDatabase } from "firebase/database"; // For Realtime DB (Chatroom)

// IMPORTANT: Replace these placeholders with your actual Firebase project config 
// You must get these values from your Firebase Console's Project Settings (Web App)
const firebaseConfig = {
  apiKey: "AIzaSyDRgC9tMKgybDKvH5Kj3ztiPnU_QA9zbiU",
  authDomain: "campus-connect-hack.firebaseapp.com",
  projectId: "campus-connect-hack",
  storageBucket: "campus-connect-hack.firebasestorage.app",
  messagingSenderId: "497826115749",
  appId: "1:497826115749:web:7738da2d98270e51e29d4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services and Export
export const auth = getAuth(app);    // For Login/Signup
export const db = getFirestore(app); // For Firestore (Events, Market, L&F)
export const rtdb = getDatabase(app); // For Realtime DB (Chatroom)

//collection ref

const colRef = collection(db, 'events');

//get collection data

getDocs(colRef)
    .then((snapshot) => {
        let events = []
        snapshot.docs.forEach((doc) => {
            events.push({ ...doc.data(), id:doc.id })
        })
        console.log(events);
    })
    .catch(err =>{
        console.log(err.message);
    })

    //signing users up
    const signupForm = document.querySelector('.signup');
    signupForm.addEventListener('submit', (e) =>{
        e.preventDefault();
        
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        
        createUserWithEmailAndPassword(auth, email, password)
          .then((cred) =>{
            console.log('user created:', cred.user);
            signupForm.reset();
        })
            .catch((err) =>{
            console.log(err.message);
            })
    })

    //logging out
    const logoutButton = document.querySelector('.logout');
    logoutButton.addEventListener('click', () =>{
        signOut(auth).then(() =>{
            console.log('the user signed out'); 
        }).catch((err) =>{
            console.log(err.message);
        })
    })

    //logging in
    const loginForm = document.querySelector('.login');
    loginForm.addEventListener('submit', (e) =>{
        e.preventDefault();

        const email = loginForm.email.value
        const password = loginForm.password.value

        signInWithEmailAndPassword(auth, email, password)
        .then((cred) =>{
            console.log('user logged in:', cred.user);
            loginForm.reset();
        })
        .catch((err) =>{
            console.log(err.message);
        })
    })

    //subscribing to auth changes
    onAuthStateChanged(auth, (user) =>{
        console.log('user status changed:', user);
    })