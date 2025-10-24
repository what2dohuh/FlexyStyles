// cartContext.jsx - Cart context with Firestore synchronization
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './authContext';
import {
  saveCartToFirestore,
  getCartFromFirestore,
  mergeGuestCartWithUserCart,
  clearCartFromFirestore
} from '../services/cartServices';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load cart on mount and when user changes
  useEffect(() => {
    loadCart();
  }, [currentUser]);

  // Save to Firestore whenever cart changes (only for logged-in users)
  useEffect(() => {
    if (currentUser && !isLoading && !isSyncing) {
      saveCartToFirestore(currentUser.uid, cartItems).catch(error => {
        console.error('Failed to sync cart:', error);
      });
    }
  }, [cartItems, currentUser, isLoading, isSyncing]);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      if (currentUser) {
        // User is logged in
        // Get guest cart from localStorage
        const guestCart = getGuestCartFromLocalStorage();
        
        if (guestCart.length > 0) {
          // Merge guest cart with user's Firestore cart
          setIsSyncing(true);
          const mergedCart = await mergeGuestCartWithUserCart(currentUser.uid, guestCart);
          setCartItems(mergedCart);
          // Clear guest cart from localStorage
          localStorage.removeItem('guestCart');
          setIsSyncing(false);
        } else {
          // Just load user's Firestore cart
          const userCart = await getCartFromFirestore(currentUser.uid);
          setCartItems(userCart);
        }
      } else {
        // User is not logged in, load from localStorage
        const guestCart = getGuestCartFromLocalStorage();
        setCartItems(guestCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      // Fallback to localStorage on error
      const guestCart = getGuestCartFromLocalStorage();
      setCartItems(guestCart);
    } finally {
      setIsLoading(false);
    }
  };

  const getGuestCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('guestCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error reading guest cart:', error);
      return [];
    }
  };

  const saveGuestCartToLocalStorage = (cart) => {
    try {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  // Calculate total number of items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id && 
                item.selectedSize === product.selectedSize && 
                item.selectedColor === product.selectedColor
      );

      let newCart;
      if (existingItem) {
        newCart = prevItems.map(item =>
          item.id === product.id && 
          item.selectedSize === product.selectedSize && 
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevItems, { ...product, quantity: 1 }];
      }

      // Save to localStorage for guest users
      if (!currentUser) {
        saveGuestCartToLocalStorage(newCart);
      }

      return newCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, selectedSize, selectedColor) => {
    setCartItems(prevItems => {
      const newCart = prevItems.filter(
        item => !(item.id === productId && 
                 item.selectedSize === selectedSize && 
                 item.selectedColor === selectedColor)
      );

      // Save to localStorage for guest users
      if (!currentUser) {
        saveGuestCartToLocalStorage(newCart);
      }

      return newCart;
    });
  };

  // Update item quantity
  const updateQuantity = (productId, selectedSize, selectedColor, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    setCartItems(prevItems => {
      const newCart = prevItems.map(item =>
        item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
          ? { ...item, quantity: newQuantity }
          : item
      );

      // Save to localStorage for guest users
      if (!currentUser) {
        saveGuestCartToLocalStorage(newCart);
      }

      return newCart;
    });
  };

  // Clear entire cart
  const clearCart = async () => {
    setCartItems([]);
    
    if (currentUser) {
      // Clear from Firestore
      try {
        await clearCartFromFirestore(currentUser.uid);
      } catch (error) {
        console.error('Error clearing Firestore cart:', error);
      }
    } else {
      // Clear from localStorage
      localStorage.removeItem('guestCart');
    }
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;