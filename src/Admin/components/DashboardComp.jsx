import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import Sidebar from '../components/SideBarComp';
import EditProductsTab from '../components/EditProductTab';
import AddProductForm from '../components/AddProductForm';
import OrdersTab from '../components/OrdersTab';
import { 
  getAllProducts, 
  deleteProduct, 
  updateProduct,
  getAllOrders,
  updateOrderStatus 
} from '../services/firestoreService';
import { logout } from '../../services/authServices';
import { useNavigate } from 'react-router-dom';

const DashboardComp = () => {
  const [activeTab, setActiveTab] = useState('edit');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // Load products and orders on component mount
  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const fetchedOrders = await getAllOrders();
      // Convert Firestore Timestamps to readable dates
      const formattedOrders = fetchedOrders.map(order => ({
        ...order,
        date: order.createdAt?.toDate().toISOString().split('T')[0] || 'N/A'
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders');
    }
  };

  const handleProductAdded = async (productId) => {
    console.log('New product added with ID:', productId);
    // Reload products to show the new one
    await loadProducts();
    // Switch to edit tab to see the new product
    setActiveTab('edit');
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = async () => {
    try {
      const { id, createdAt, updatedAt, ...updateData } = editingProduct;
      await updateProduct(id, updateData);
      
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleLogout = async () => {  
      const success = await logout();
      if (success) {
        navigate('/login');
    }
    else{
      alert('Logout failed. Please try again.');
  }
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === 'Pending') return 'Shipped';
    if (currentStatus === 'Shipped') return 'Delivered';
    return 'Delivered';
  };

  return (
    <div className="adm-dashboard">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      <main className="adm-main">
        <div className="adm-content">
          {activeTab === 'edit' && (
            <>
              {isLoading ? (
                <div className="adm-loading">
                  <p>Loading products...</p>
                </div>
              ) : (
                <EditProductsTab
                  products={products}
                  editingProduct={editingProduct}
                  setEditingProduct={setEditingProduct}
                  handleSaveEdit={handleSaveEdit}
                  handleCancelEdit={handleCancelEdit}
                  handleEditProduct={handleEditProduct}
                  handleDeleteProduct={handleDeleteProduct}
                />
              )}
            </>
          )}

          {activeTab === 'add' && (
            <div className="adm-tab-content">
              <h1 className="adm-title">Add New Product</h1>
              <AddProductForm onProductAdded={handleProductAdded} />
            </div>
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              handleOrderStatusChange={handleOrderStatusChange}
              getNextStatus={getNextStatus}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardComp;