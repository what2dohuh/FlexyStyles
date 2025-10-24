import React from 'react';
import '../styles/Dashboard.css';

const OrderCard = ({ order, handleOrderStatusChange, getNextStatus }) => {
  return (
    <div className="adm-order-card">
      {/* Header */}
      <div className="adm-order-header">
        <div>
          <h3>Order #{order.id}</h3>
          <p className="adm-order-date">{order.date}</p>
          <p className="adm-order-date">Order Date: {new Date(order.orderDate).toLocaleString()}</p>
        </div>
        <span className={`adm-status adm-status-${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>

      {/* Body */}
      <div className="adm-order-body">
        {/* Product Image */}
        {order.productImage && (
          <div className="adm-order-img">
            <img src={order.productImage} alt={order.product} />
          </div>
        )}

        {/* Order Details */}
        <div className="adm-order-details">
          <p><strong>Customer:</strong> {order.customer}</p>
          <p><strong>Email:</strong> {order.customerEmail}</p>
          <p><strong>Product:</strong> {order.product}</p>
          <p><strong>Product ID:</strong> {order.productId}</p>
          <p><strong>Quantity:</strong> {order.quantity}</p>
          <p><strong>Size:</strong> {Array.isArray(order.size) ? order.size.join(', ') : order.size}</p>
          <p><strong>Color:</strong> {Array.isArray(order.color) ? order.color.join(', ') : order.color}</p>
          <p><strong>Price:</strong> ${order.price}</p>
          <p><strong>Total:</strong> ${order.total}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        </div>
      </div>

      {/* Shipping Info */}
      {order.shippingInfo && (
        <div className="adm-order-shipping">
          <h4>Shipping Info</h4>
          <p><strong>Name:</strong> {order.shippingInfo.fullName}</p>
          <p><strong>State:</strong> {order.shippingInfo.state}</p>
          <p><strong>City:</strong> {order.shippingInfo.city}</p>
          <p><strong>Address:</strong> {order.shippingInfo.address}</p>
          <p><strong>Zip Code:</strong> {order.shippingInfo.zipCode}</p>
          <p><strong>Phone:</strong> {order.shippingInfo.phone}</p>
        </div>
      )}

      {/* Status History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="adm-order-history">
          <h4>Status History</h4>
          <ul>
            {order.statusHistory.map((s, i) => (
              <li key={i}>
                <strong>{s.status}</strong> — {new Date(s.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer Actions */}
      <div className="adm-order-actions">
        {order.status !== 'Delivered' && (
          <button
            onClick={() => handleOrderStatusChange(order.id, getNextStatus(order.status))}
            className="adm-btn adm-btn-status"
          >
            Mark as {getNextStatus(order.status)}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
