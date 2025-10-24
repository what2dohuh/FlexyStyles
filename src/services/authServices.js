// src/services/authService.js
import { auth, db } from "../firebaseconfig";
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Register User with Role
export const register = async (email, password, role = "user") => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      role,
      createdAt: new Date()
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// Login User
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Logout User
export const logout = async () => {
try {
    await auth.signOut();
    return true; // success
  } catch (error) {
    console.error("Logout failed:", error);
    return false; // failed
  }
};

// Get User Role
export const getUserRole = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().role;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser; 
};
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

export { auth };
