import '../styles/Dashboard.css';

const ProductCard = ({ 
  product, 
  editingProduct, 
  setEditingProduct,
  handleSaveEdit,
  handleCancelEdit,
  handleEditProduct,
  handleDeleteProduct
}) => {
  const isEditing = editingProduct && editingProduct.id === product.id;

  if (isEditing) {
    return (
      <div className="adm-product-card">
        <div className="adm-edit-form">
          <input
            type="text"
            value={editingProduct.name}
            onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
            className="adm-input"
            placeholder="Product Name"
          />
          <input
            type="text"
            value={editingProduct.category}
            onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
            className="adm-input"
            placeholder="Category"
          />
          <input
            type="number"
            value={editingProduct.price}
            onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
            className="adm-input"
            placeholder="Price"
          />
          <textarea
            value={editingProduct.description}
            onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
            className="adm-textarea"
            placeholder="Description"
          />
          <div className="adm-edit-actions">
            <button onClick={handleSaveEdit} className="adm-btn adm-btn-save">Save</button>
            <button onClick={handleCancelEdit} className="adm-btn adm-btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-product-card">
      {product.images[0] && (
        <img src={product.images[0]} alt={product.name} className="adm-product-image" />
      )}
      {product.isNew && <span className="adm-badge-new">NEW</span>}
      <div className="adm-product-info">
        <h3 className="adm-product-name">{product.name}</h3>
        <p className="adm-product-category">{product.category}</p>
        <p className="adm-product-price">${product.price}</p>
        
        {product.sizes && product.sizes.length > 0 && (
          <div className="adm-product-meta">
            <strong>Sizes:</strong> {product.sizes.join(', ')}
          </div>
        )}
        
        {product.colors && product.colors.length > 0 && (
          <div className="adm-product-meta">
            <strong>Colors:</strong> {product.colors.join(', ')}
          </div>
        )}
        
        <p className="adm-product-desc">{product.description}</p>
        
        {product.features && product.features.length > 0 && (
          <div className="adm-product-features">
            <strong>Features:</strong>
            <ul>
              {product.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}
        
        <div className="adm-product-actions">
          <button onClick={() => handleEditProduct(product)} className="adm-btn adm-btn-edit">
            Edit
          </button>
          <button onClick={() => handleDeleteProduct(product.id)} className="adm-btn adm-btn-delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;