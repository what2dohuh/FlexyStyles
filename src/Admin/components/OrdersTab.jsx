import React from 'react';
import '../styles/Dashboard.css';
import OrderCard from './OrderCard';

const OrdersTab = ({ orders, handleOrderStatusChange, getNextStatus }) => {
  return (
    <div className="adm-tab-content">
      <h1 className="adm-title">Orders</h1>
      <div className="adm-orders-list">
        {console.log(orders)}
        {orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            handleOrderStatusChange={handleOrderStatusChange}
            getNextStatus={getNextStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;