// services/firestoreService.js
import { db } from "../firebaseconfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

/**
 * Get all products
 */
export const getAllProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Get New Arrival Products
 * Products should have `isNew: true`
 */
export const getNewArrivalProducts = async () => {
  const q = query(collection(db, "products"), where("isNew", "==", true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Get Limited Offer Products
 * Products should have `limitedOffer: true` (add this field when creating product)
 */
export const getLimitedOfferProducts = async () => {
  const q = query(collection(db, "products"), where("limitedOffer", "==", true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
