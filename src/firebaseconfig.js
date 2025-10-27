// firebase.js - Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";

// Your Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "",

  authDomain: "",

  projectId: "",

  storageBucket: "",

  messagingSenderId: "",

  appId: "",

  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Storage (for image uploads)
export const storage = getStorage(app);

export default app;