// cartService.js - Firestore cart operations
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebaseconfig';

const CARTS_COLLECTION = 'carts';

/**
 * Save cart to Firestore for logged-in user
 * @param {string} userId - User ID
 * @param {Array} cartItems - Cart items array
 * @returns {Promise<void>}
 */
export const saveCartToFirestore = async (userId, cartItems) => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    await setDoc(cartRef, {
      items: cartItems,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving cart to Firestore:', error);
    throw error;
  }
};

/**
 * Get cart from Firestore for logged-in user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Cart items array
 */
export const getCartFromFirestore = async (userId) => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      return cartSnap.data().items || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting cart from Firestore:', error);
    throw error;
  }
};

/**
 * Merge guest cart with user's saved cart
 * @param {string} userId - User ID
 * @param {Array} guestCart - Guest cart items
 * @returns {Promise<Array>} Merged cart items
 */
export const mergeGuestCartWithUserCart = async (userId, guestCart) => {
  try {
    // Get user's saved cart from Firestore
    const userCart = await getCartFromFirestore(userId);
    
    // If no guest cart, return user cart
    if (!guestCart || guestCart.length === 0) {
      return userCart;
    }
    
    // If no user cart, save and return guest cart
    if (!userCart || userCart.length === 0) {
      await saveCartToFirestore(userId, guestCart);
      return guestCart;
    }
    
    // Merge carts: combine items with same id, size, and color
    const mergedCart = [...userCart];
    
    guestCart.forEach(guestItem => {
      const existingItemIndex = mergedCart.findIndex(
        item => item.id === guestItem.id && 
                item.selectedSize === guestItem.selectedSize && 
                item.selectedColor === guestItem.selectedColor
      );
      
      if (existingItemIndex >= 0) {
        // Item exists, add quantities
        mergedCart[existingItemIndex].quantity += guestItem.quantity;
      } else {
        // New item, add to cart
        mergedCart.push(guestItem);
      }
    });
    
    // Save merged cart to Firestore
    await saveCartToFirestore(userId, mergedCart);
    
    return mergedCart;
  } catch (error) {
    console.error('Error merging carts:', error);
    throw error;
  }
};

/**
 * Clear cart from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const clearCartFromFirestore = async (userId) => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    await setDoc(cartRef, {
      items: [],
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error clearing cart from Firestore:', error);
    throw error;
  }
};

/**
 * Add single item to Firestore cart
 * @param {string} userId - User ID
 * @param {Object} item - Cart item
 * @returns {Promise<void>}
 */
export const addItemToFirestoreCart = async (userId, item) => {
  try {
    const currentCart = await getCartFromFirestore(userId);
    
    const existingItemIndex = currentCart.findIndex(
      cartItem => cartItem.id === item.id && 
                   cartItem.selectedSize === item.selectedSize && 
                   cartItem.selectedColor === item.selectedColor
    );
    
    if (existingItemIndex >= 0) {
      currentCart[existingItemIndex].quantity += item.quantity;
    } else {
      currentCart.push(item);
    }
    
    await saveCartToFirestore(userId, currentCart);
  } catch (error) {
    console.error('Error adding item to Firestore cart:', error);
    throw error;
  }
};

/**
 * Remove item from Firestore cart
 * @param {string} userId - User ID
 * @param {string} itemId - Item ID
 * @param {string} size - Selected size
 * @param {string} color - Selected color
 * @returns {Promise<void>}
 */
export const removeItemFromFirestoreCart = async (userId, itemId, size, color) => {
  try {
    const currentCart = await getCartFromFirestore(userId);
    const updatedCart = currentCart.filter(
      item => !(item.id === itemId && 
                item.selectedSize === size && 
                item.selectedColor === color)
    );
    await saveCartToFirestore(userId, updatedCart);
  } catch (error) {
    console.error('Error removing item from Firestore cart:', error);
    throw error;
  }
};

/**
 * Update item quantity in Firestore cart
 * @param {string} userId - User ID
 * @param {string} itemId - Item ID
 * @param {string} size - Selected size
 * @param {string} color - Selected color
 * @param {number} quantity - New quantity
 * @returns {Promise<void>}
 */
export const updateItemQuantityInFirestore = async (userId, itemId, size, color, quantity) => {
  try {
    const currentCart = await getCartFromFirestore(userId);
    const updatedCart = currentCart.map(item => {
      if (item.id === itemId && 
          item.selectedSize === size && 
          item.selectedColor === color) {
        return { ...item, quantity };
      }
      return item;
    });
    await saveCartToFirestore(userId, updatedCart);
  } catch (error) {
    console.error('Error updating item quantity in Firestore:', error);
    throw error;
  }
};