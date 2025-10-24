import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contex/authContext';
import { useCart } from '../contex/cartContext';
import { addOrder } from '../Admin/services/firestoreService';
import '../styles/pagesStyles/Checkout.css';
import LoginComponent from './Auth/LoginInCheckoutComp';
import PaymentButton from '../components/RazorPayBtn';

function Checkout() {
  const { currentUser } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowItem = location.state?.buyNowItem;
  const isBuyNow = !!buyNowItem;

  const checkoutItems = isBuyNow ? [buyNowItem] : cartItems;
  const checkoutTotal = isBuyNow 
    ? buyNowItem.price * buyNowItem.quantity 
    : cartTotal;

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  if (!currentUser) {
    return (
      <div className="checkout-container">
        <div className="checkout-login-prompt">
          <h2>Please login to continue with checkout</h2>
          <p>You need to be logged in to complete your purchase</p>
          <LoginComponent />
        </div>
      </div>
    );
  }

  if (!checkoutItems || checkoutItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h2>No items to checkout</h2>
          <p>Add some items to your cart before checking out</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const isShippingInfoComplete = () => {
  return (
    shippingInfo.fullName.trim() &&
    shippingInfo.email.trim() &&
    shippingInfo.phone.trim() &&
    shippingInfo.address.trim() &&
    shippingInfo.city.trim() &&
    shippingInfo.state.trim() &&
    shippingInfo.zipCode.trim() &&
    shippingInfo.country.trim()
  );
};

  const validateForm = () => {
    const newErrors = {};

    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!shippingInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!shippingInfo.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!shippingInfo.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    if (!shippingInfo.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  };

  // Create orders in database after successful payment
  const createOrdersInDatabase = async (paymentInfo) => {
    try {
      const shippingCost = checkoutTotal > 100 ? 0 : 9.99;
      const tax = checkoutTotal * 0.08;
      const totalAmount = checkoutTotal + shippingCost + tax;

      // Create orders for each item
      const orderPromises = checkoutItems.map(item => {
        return addOrder({
          // Order Number
          orderNumber: paymentInfo.orderNumber,
          
          // Customer Information
          customer: shippingInfo.fullName,
          customerEmail: shippingInfo.email,
          userId: currentUser.uid,
          
          // Product Information
          product: item.name,
          productId: item.id,
          quantity: item.quantity,
          size: item.selectedSize || item.sizes || 'N/A',
          color: item.selectedColor || item.colors || 'N/A',
          productImage: item.images?.[0] || '',
          
          // Pricing
          price: item.price,
          total: item.price * item.quantity,
          subtotal: checkoutTotal,
          shippingCost: shippingCost,
          tax: tax,
          totalAmount: totalAmount,
          
          // Order Status
          status: 'Processing', // Changed from Pending since payment is done
          
          // Shipping Information
          shippingInfo: {
            fullName: shippingInfo.fullName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zipCode: shippingInfo.zipCode,
            country: shippingInfo.country
          },
          
          // Payment Information
          paymentMethod: 'Razorpay',
          paymentStatus: 'Paid',
          paymentId: paymentInfo.paymentId,
          razorpayOrderId: paymentInfo.orderId,
          
          // Order Date
          orderDate: new Date().toISOString(),
          paidAt: new Date().toISOString(),
          
          // Order Type
          orderType: isBuyNow ? 'Buy Now' : 'Cart'
        });
      });

      await Promise.all(orderPromises);

      // Clear cart only if this was a cart checkout
      if (!isBuyNow) {
        clearCart();
      }

      return true;
    } catch (error) {
      console.error('Error creating orders in database:', error);
      throw error;
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentInfo) => {
    setIsProcessing(true);

    try {
      // Create orders in database
      await createOrdersInDatabase(paymentInfo);

      // Navigate to success page
      navigate('/order-success', {
        state: { 
          orderNumber: paymentInfo.orderNumber,
          paymentId: paymentInfo.paymentId
        }
      });
    } catch (error) {
      console.error('Error after payment:', error);
      alert('Payment was successful, but there was an error saving your order. Please contact support with your payment ID: ' + paymentInfo.paymentId);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment error
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert('Payment failed: ' + error.message + '. Please try again.');
    setIsProcessing(false);
  };

  // Prepare order data for payment
  const prepareOrderData = () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return null;
    }

    const shippingCost = checkoutTotal > 100 ? 0 : 9.99;
    const tax = checkoutTotal * 0.08;
    const totalAmount = checkoutTotal + shippingCost + tax;
    const orderNumber = generateOrderNumber();

    return {
      orderNumber,
      totalAmount,
      subtotal: checkoutTotal,
      shippingCost,
      tax,
      items: checkoutItems,
      shippingInfo,
      userId: currentUser.uid
    };
  };

  const shippingCost = checkoutTotal > 100 ? 0 : 9.99;
  const tax = checkoutTotal * 0.08;
  const totalAmount = checkoutTotal + shippingCost + tax;

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-left">
          <h1>Checkout</h1>
          {isBuyNow && (
            <div className="buy-now-indicator">
              <p>🛍️ Quick Buy Checkout</p>
            </div>
          )}

          {/* Shipping Information */}
          <section className="checkout-section">
            <h2>Shipping Information</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-group full-width">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, Apt 4"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  placeholder="Imphal"
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  placeholder="Manipur"
                  className={errors.state ? 'error' : ''}
                />
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleInputChange}
                  placeholder="795001"
                  className={errors.zipCode ? 'error' : ''}
                />
                {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
              </div>

              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  placeholder="India"
                  className={errors.country ? 'error' : ''}
                />
                {errors.country && <span className="error-text">{errors.country}</span>}
              </div>
            </div>
          </section>

          {/* Payment Method Info */}
          <section className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-info">
              <p>💳 Secure payment powered by Razorpay</p>
              <p>You will be redirected to complete your payment securely</p>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="checkout-right">
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="order-items">
              {checkoutItems.map((item, index) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="order-item">
                  <img src={item.images[0]} alt={item.name} />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                    {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{checkoutTotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="total-row">
                <span>Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="total-row total-final">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <PaymentButton 
              getOrderData={prepareOrderData}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              disabled={isProcessing || !isShippingInfoComplete()}
            />

            <p className="secure-checkout">
              🔒 Secure Checkout - Your information is protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;