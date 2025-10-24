// services/userServices.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebaseconfig';

// Get user profile with addresses
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } else {
      // Create new user profile if doesn't exist
      const newProfile = {
        addresses: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(userRef, newProfile);
      return { id: userId, ...newProfile };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Add a new address
export const addUserAddress = async (userId, addressData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    // Create address with unique ID
    const newAddress = {
      ...addressData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    if (userDoc.exists()) {
      // Get existing addresses
      const existingAddresses = userDoc.data().addresses || [];
      
      // If this is set as default, unset other defaults
      let updatedAddresses = existingAddresses;
      if (newAddress.isDefault) {
        updatedAddresses = existingAddresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }
      
      // Add new address
      updatedAddresses.push(newAddress);
      
      await updateDoc(userRef, {
        addresses: updatedAddresses,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new user document with address
      await setDoc(userRef, {
        addresses: [newAddress],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return newAddress;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

// Update an existing address
export const updateUserAddress = async (userId, addressId, updatedData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      let addresses = userDoc.data().addresses || [];
      
      // If setting as default, unset other defaults
      if (updatedData.isDefault) {
        addresses = addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId ? true : false
        }));
      }
      
      // Update the specific address
      addresses = addresses.map(addr => 
        addr.id === addressId 
          ? { ...addr, ...updatedData, updatedAt: new Date().toISOString() }
          : addr
      );
      
      await updateDoc(userRef, {
        addresses: addresses,
        updatedAt: serverTimestamp()
      });
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Delete an address
export const deleteUserAddress = async (userId, addressId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const addresses = userDoc.data().addresses || [];
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      
      await updateDoc(userRef, {
        addresses: updatedAddresses,
        updatedAt: serverTimestamp()
      });
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// Set default address
export const setDefaultAddress = async (userId, addressId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const addresses = userDoc.data().addresses || [];
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      
      await updateDoc(userRef, {
        addresses: updatedAddresses,
        updatedAt: serverTimestamp()
      });
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};