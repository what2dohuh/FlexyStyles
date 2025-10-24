// services/orderServices.js
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  arrayUnion 
} from 'firebase/firestore';
import { db } from '../firebaseconfig';

// Get all orders (Admin)
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
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
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Get orders by user ID (Customer)
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef, 
      where('userId', '==', userId),
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
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Get single order by ID
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (orderDoc.exists()) {
      return {
        id: orderDoc.id,
        ...orderDoc.data()
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (orderId, newStatus, note = '') => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    
    const statusHistoryEntry = {
      status: newStatus,
      timestamp: Timestamp.now(),
      note: note || `Order status updated to ${newStatus}`
    };
    
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: Timestamp.now(),
      statusHistory: arrayUnion(statusHistoryEntry)
    });
    
    return { success: true, message: 'Order status updated successfully' };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Get orders by status (Admin)
export const getOrdersByStatus = async (status) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef, 
      where('status', '==', status),
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
    console.error('Error fetching orders by status:', error);
    throw error;
  }
};

// Get order statistics (Admin Dashboard)
export const getOrderStatistics = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);
    
    let totalOrders = 0;
    let totalRevenue = 0;
    let statusCounts = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalOrders++;
      totalRevenue += data.totalAmount || 0;
      
      if (statusCounts.hasOwnProperty(data.status)) {
        statusCounts[data.status]++;
      }
    });
    
    return {
      totalOrders,
      totalRevenue,
      statusCounts
    };
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw error;
  }
};