import React from 'react';
import '../styles/Dashboard.css';
import ProductCard from './ProductCard';

const EditProductsTab = ({
  products,
  editingProduct,
  setEditingProduct,
  handleSaveEdit,
  handleCancelEdit,
  handleEditProduct,
  handleDeleteProduct
}) => {
  return (
    <div className="adm-tab-content">
      <h1 className="adm-title">Edit Products</h1>
      <div className="adm-products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default EditProductsTab;