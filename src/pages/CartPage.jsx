import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contex/cartContext';
import "../styles/pagesStyles/Cart.css";
import NavbarCom from '../components/NavbarCom';

function CartPage() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, isLoading } = useCart();
  const navigate = useNavigate();
  
  // Show loading state while cart is being loaded/synced
  if (isLoading) {
    return (
      <div className="cart-container">
        <div className="cart-loading">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some items to get started!</p>
          <button onClick={() => navigate('/shop')} className="btn-shop">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item.id, item.selectedSize, item.selectedColor, newQuantity);
  };

  const handleRemoveItem = (item) => {
    if (window.confirm('Remove this item from cart?')) {
      removeFromCart(item.id, item.selectedSize, item.selectedColor);
    }
  };

  return (
    <>
    <NavbarCom/>
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="item-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="cart-main">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="cart-item">
                <Link to={`/productdetail/${item.id}`} >
                <div className="item-image">
                  <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} />
                </div>
                </Link>

                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  
                  <div className="item-variants">
                    {item.selectedSize && (
                      <span className="variant-tag">Size: {item.selectedSize}</span>
                    )}
                    {item.selectedColor && (
                      <span className="variant-tag">Color: {item.selectedColor}</span>
                    )}
                  </div>

                  <div className="item-price-mobile">
                    ₹{item.price.toFixed(2)}
                  </div>
                </div>

                <div className="item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    className="qty-btn"
                    disabled={item.quantity <= 1}
                    >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 1)}
                    min="1"
                    className="qty-input"
                  />
                  <button 
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    className="qty-btn"
                    >
                    +
                  </button>
                </div>

                <div className="item-price">
                  ₹{item.price.toFixed(2)}
                </div>

                <div className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => handleRemoveItem(item)}
                  className="item-remove"
                  title="Remove item"
                  >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-row">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="btn-checkout"
                >
                Proceed to Checkout
              </button>

              <button 
                onClick={() => navigate('/shop')}
                className="btn-continue"
                >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default CartPage;