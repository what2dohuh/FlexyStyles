// firestoreService.js - All Firestore operations
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseconfig';

// Collection names
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

// ============ PRODUCT OPERATIONS ============

/**
 * Add a new product to Firestore
 * @param {Object} productData - Product data object
 * @param {Array} imageFiles - Array of image File objects (optional)
 * @returns {Promise<string>} - Document ID of created product
 */
export const addProduct = async (productData, imageFiles = []) => {
  try {
    // Upload images to Firebase Storage if provided
    let imageUrls = [];
    if (imageFiles.length > 0) {
      imageUrls = await uploadProductImages(imageFiles);
    }

    // Structure the product data for Firestore
    const structuredProduct = {
      // Basic Information
      name: productData.name,
      category: productData.category,
      price: parseFloat(productData.price),
      description: productData.description || '',
      
      // Images
      images: imageUrls.length > 0 ? imageUrls : productData.images || [],
      
      // Variants
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      
      // Features and Details
      features: productData.features || [],
      details: {
        material: productData.details?.material || '',
        fit: productData.details?.fit || '',
        care: productData.details?.care || ''
      },
      
      // Status flags
      isNew: productData.isNew || false,
      isActive: true,
      inStock: true,
      
      // Metadata
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // For inventory management (optional)
      stock: productData.stock || 0,
      sku: productData.sku || generateSKU(productData.name),
      
      // For search and filtering
      categoryLower: productData.category.toLowerCase(),
      nameLower: productData.name.toLowerCase(),
      tags: generateTags(productData)
    };

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), structuredProduct);
    console.log('Product added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Upload product images to Firebase Storage
 * @param {Array} imageFiles - Array of File objects
 * @returns {Promise<Array>} - Array of download URLs
 */
const uploadProductImages = async (imageFiles) => {
  const uploadPromises = imageFiles.map(async (file, index) => {
    const timestamp = Date.now();
    const fileName = `products/${timestamp}_${index}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  });

  return Promise.all(uploadPromises);
};

/**
 * Get all products from Firestore
 * @returns {Promise<Array>} - Array of products with IDs
 */
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

/**
 * Get a single product by ID
 * @param {string} productId - Product document ID
 * @returns {Promise<Object>} - Product data with ID
 */
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

/**
 * Update a product
 * @param {string} productId - Product document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateProduct = async (productId, updates) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    
    // Add updated timestamp
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    // Update search fields if name or category changed
    if (updates.name) {
      updateData.nameLower = updates.name.toLowerCase();
    }
    if (updates.category) {
      updateData.categoryLower = updates.category.toLowerCase();
    }
    
    await updateDoc(docRef, updateData);
    console.log('Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 * @param {string} productId - Product document ID
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    console.log('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Query products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} - Array of products
 */
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('categoryLower', '==', category.toLowerCase()),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error querying products:', error);
    throw error;
  }
};

/**
 * Query new products
 * @returns {Promise<Array>} - Array of new products
 */
export const getNewProducts = async () => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('isNew', '==', true),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error querying new products:', error);
    throw error;
  }
};

// ============ ORDER OPERATIONS ============

/**
 * Add a new order
 * @param {Object} orderData - Order data
 * @returns {Promise<string>} - Order ID
 */
export const addOrder = async (orderData) => {
  try {
    const structuredOrder = {
     // Customer Information
      customer: orderData.customer,
      customerEmail: orderData.customerEmail || '',
      userId: orderData.userId,
      
      // Product Information
      product: orderData.product,
      productId: orderData.productId || '',
      quantity: orderData.quantity || 1,
      size: orderData.size || 'N/A',
      color: orderData.color || 'N/A',
      productImage: orderData.productImage || '',
      
      // Pricing
      price: parseFloat(orderData.price) || 0,
      total: parseFloat(orderData.total),
      
      // Order Status
      status: orderData.status || 'Pending',
      statusLower: (orderData.status || 'Pending').toLowerCase(),
      
      // Shipping Information
      shippingInfo: orderData.shippingInfo ? {
        fullName: orderData.shippingInfo.fullName || '',
        email: orderData.shippingInfo.email || '',
        phone: orderData.shippingInfo.phone || '',
        address: orderData.shippingInfo.address || '',
        city: orderData.shippingInfo.city || '',
        state: orderData.shippingInfo.state || '',
        zipCode: orderData.shippingInfo.zipCode || '',
        country: orderData.shippingInfo.country || ''
      } : null,
      
      // Payment Information
      paymentMethod: orderData.paymentMethod || 'card',
      
      // Order Date
      orderDate: orderData.orderDate || new Date().toISOString(),
      
      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // Status History for tracking
      statusHistory: [
        {
          status: orderData.status || 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed successfully'
        }
      ]
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), structuredOrder);
    return docRef.id;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

/**
 * Get all orders
 * @returns {Promise<Array>} - Array of orders
 */
export const getAllOrders = async () => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId - Order document ID
 * @param {string} newStatus - New status
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status: newStatus,
      statusLower: newStatus.toLowerCase(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// ============ UTILITY FUNCTIONS ============

/**
 * Generate SKU from product name
 * @param {string} name - Product name
 * @returns {string} - Generated SKU
 */
const generateSKU = (name) => {
  const prefix = name.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${timestamp}`;
};

/**
 * Generate search tags from product data
 * @param {Object} productData - Product data
 * @returns {Array} - Array of search tags
 */
const generateTags = (productData) => {
  const tags = [];
  
  // Add name words
  if (productData.name) {
    tags.push(...productData.name.toLowerCase().split(' '));
  }
  
  // Add category
  if (productData.category) {
    tags.push(productData.category.toLowerCase());
  }
  
  // Add colors
  if (productData.colors && productData.colors.length > 0) {
    tags.push(...productData.colors.map(c => c.toLowerCase()));
  }
  
  // Remove duplicates
  return [...new Set(tags)];
};