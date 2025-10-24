import '../styles/pagesStyles/MyAccount.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarCom from '../components/NavbarCom';
import { getCurrentUser, logout } from '../services/authServices';
import { getUserOrders } from '../services/orderServices';
import { 
  getUserProfile, 
  addUserAddress, 
  updateUserAddress, 
  deleteUserAddress, 
  setDefaultAddress 
} from '../services/userServices';
import LoadingComp from '../components/LoadingComp';

function MyAccount() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('orders');
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false
  });

  const statusColors = {
    Pending: '#ffc107',
    Processing: '#2196f3',
    Shipped: '#9c27b0',
    Delivered: '#4caf50',
    Cancelled: '#f44336'
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      fetchUserData(currentUser.uid);
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      
      // Fetch user profile (including addresses)
      const profile = await getUserProfile(userId);
      setAddresses(profile.addresses || []);
      
      // Fetch user orders
      const userOrders = await getUserOrders(userId);
      setOrders(userOrders);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = async (id) => {
    try {
      await setDefaultAddress(user.uid, id);
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      await deleteUserAddress(user.uid, id);
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    }
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        isDefault: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      isDefault: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingAddress) {
        // Update existing address
        await updateUserAddress(user.uid, editingAddress.id, formData);
        setAddresses(addresses.map(addr => 
          addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr
        ));
      } else {
        // Add new address
        const newAddress = await addUserAddress(user.uid, formData);
        setAddresses([...addresses, newAddress]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    }
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/');
    } else {
      alert('Failed to logout. Please try again.');
    }
  };

  const getStatusClass = (status) => {
    return `status-${status.toLowerCase()}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewOrderDetails = (order) => {
    // Navigate to order details or show modal
    navigate('/order-details', { state: { order } });
  };

  // Filter upcoming deliveries (Shipped orders)
  const upcomingDeliveries = orders.filter(order => 
    order.status === 'Shipped' || order.status === 'Processing'
  );

  if (loading) {
    return (
      <>
        <NavbarCom />
        <div className="loading-container">
          <LoadingComp/>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarCom />
      {user && (
        <div className="account-page">
          <div className="account-container">
            <div className="account-header">
              <h1>My Account</h1>
              <p>Manage your orders, addresses, and account settings</p>
            </div>

            <div className="account-layout">
              {/* Sidebar */}
              <aside className="account-sidebar">
                <ul className="sidebar-nav">
                  <li>
                    <button 
                      className={activeSection === 'orders' ? 'active' : ''}
                      onClick={() => setActiveSection('orders')}
                    >
                       <svg className="icon-svg" viewBox="0 0 24 24">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                      </svg>
                      Orders ({orders.length})
                    </button>
                  </li>
                  <li>
                    <button 
                      className={activeSection === 'addresses' ? 'active' : ''}
                      onClick={() => setActiveSection('addresses')}
                    >
                      <svg className="icon-svg" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      Addresses ({addresses.length})
                    </button>
                  </li>
                  <li>
                    <button className="logout-btn" onClick={handleLogout}>
                      <svg className="icon-svg" viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </li>
                </ul>
              </aside>

              {/* Main Content */}
              <main className="account-content">
                {/* Order History Section */}
                <section className={`content-section ${activeSection === 'orders' ? 'active' : ''}`}>
                  <div className="section-header">
                    <h2>Order History</h2>
                  </div>
                  {orders.length > 0 ? (
                    <div className="order-list">
                      {orders.map(order => (
                        <div key={order.id} className="order-card">
                          {console.log(orders)}
                          <div className="order-header">
                            <div>
                              <div className="order-id">{order.orderNumber}</div>
                              <div className="order-date">{formatDate(order.orderDate)}</div>
                            </div>
                            <span 
                              className={`order-status ${getStatusClass(order.status)}`}
                              style={{ backgroundColor: statusColors[order.status] }}
                            >
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="order-items">
                              <div key={order.id} className="order-item1">
                                <div className="item-info">
                                  <div className="item-image">
                                    {<img src={order?.productImage} alt={order.product} />}
                                  </div>
                                  <div className="item-details">
                                    <h4>{order.product}</h4>
                                    <p>Quantity: {order.quantity}</p>
                                    {order.size !== 'N/A' && <p>Size: {order.size}</p>}
                                    {order.color !== 'N/A' && <p>Color: {order.color}</p>}
                                  </div>
                                </div>
                                <div className="item-price">₹{order.price}</div>
                              </div>
                          </div>
                          <div className="order-footer">
                            <div className="order-total">Total: ₹{order.total?.toFixed(2)}</div>
                            {/* <button 
                              className="track-btn"
                              onClick={() => handleViewOrderDetails(order)}
                            >
                              View Details
                            </button> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <svg className="icon-svg" viewBox="0 0 24 24">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                      <h3>No Orders Yet</h3>
                      <p>You haven't placed any orders yet</p>
                      <button 
                        className="track-btn"
                        onClick={() => navigate('/shop')}
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </section>

             
                {/* Addresses Section */}
                <section className={`content-section ${activeSection === 'addresses' ? 'active' : ''}`}>
                  <div className="section-header">
                    <h2>Saved Addresses</h2>
                    <button className="add-btn" onClick={() => handleOpenModal()}>
                      <svg className="icon-svg" viewBox="0 0 24 24" style={{width: '16px', height: '16px'}}>
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Address
                    </button>
                  </div>
                  {addresses.length > 0 ? (
                    <div className="address-grid">
                      {addresses.map(address => (
                        <div 
                          key={address.id} 
                          className={`address-card ${address.isDefault ? 'selected' : ''}`}
                        >
                          {address.isDefault && (
                            <span className="address-badge">Default</span>
                          )}
                          <h3 className="address-name">{address.name}</h3>
                          <div className="address-details">
                            {address.address}<br />
                            {address.city}, {address.state} {address.zipCode}
                          </div>
                          <div className="address-phone">{address.phone}</div>
                          <div className="address-actions">
                            {!address.isDefault && (
                              <button 
                                className="select-btn"
                                onClick={() => handleSelectAddress(address.id)}
                              >
                                Set as Default
                              </button>
                            )}
                            <button 
                              className="edit-btn"
                              onClick={() => handleOpenModal(address)}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <svg className="icon-svg" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <h3>No Saved Addresses</h3>
                      <p>Add an address for faster checkout</p>
                    </div>
                  )}
                </section>
              </main>
            </div>
          </div>

          {/* Address Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                  <button className="modal-close" onClick={handleCloseModal}>
                    <svg className="icon-svg" viewBox="0 0 24 24">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Address *</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street, Apt 4B"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="New York"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="NY"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>ZIP Code *</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="10001"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>

                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isDefault">Set as default address</label>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="modal-btn modal-btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="modal-btn modal-btn-primary"
                    >
                      {editingAddress ? 'Update Address' : 'Add Address'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default MyAccount;