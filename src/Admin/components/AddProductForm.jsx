import { useState } from 'react';
import '../styles/Dashboard.css';
import ChipInput from './ChipInput';
import ImageUpload from './ImageUpload';
import { addProduct } from '../services/firestoreService';

const AddProductForm = ({ onProductAdded }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    images: [],
    sizes: [],
    colors: [],
    description: '',
    features: [],
    details: {
      material: '',
      fit: '',
      care: ''
    },
    stock: 0,
    isNew: false
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Store actual File objects for Firebase upload
    setImageFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setImagePreviews(urls);
  };

  const addSize = () => {
    if (sizeInput.trim()) {
      setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, sizeInput.trim()] });
      setSizeInput('');
    }
  };

  const removeSize = (idx) => {
    setNewProduct({ ...newProduct, sizes: newProduct.sizes.filter((_, i) => i !== idx) });
  };

  const addColor = () => {
    if (colorInput.trim()) {
      setNewProduct({ ...newProduct, colors: [...newProduct.colors, colorInput.trim()] });
      setColorInput('');
    }
  };

  const removeColor = (idx) => {
    setNewProduct({ ...newProduct, colors: newProduct.colors.filter((_, i) => i !== idx) });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setNewProduct({ ...newProduct, features: [...newProduct.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const removeFeature = (idx) => {
    setNewProduct({ ...newProduct, features: newProduct.features.filter((_, i) => i !== idx) });
  };

  const handleAddProduct = async () => {
    // Validation
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      alert('Please fill in all required fields (Name, Category, Price)');
      return;
    }

    if (parseFloat(newProduct.price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }

    setIsSubmitting(true);

    try {
      // Add product to cloudinary
      const productId = await addProduct(newProduct, imageFiles);
      
      alert('Product added successfully!');
      
      // Reset form
      setNewProduct({
        name: '',
        category: '',
        price: '',
        images: [],
        sizes: [],
        colors: [],
        description: '',
        features: [],
        details: {
          material: '',
          fit: '',
          care: ''
        },
        stock: 0,
        isNew: false
      });
      setImagePreviews([]);
      setImageFiles([]);
      
      // Notify parent component to refresh products list
      if (onProductAdded) {
        onProductAdded(productId);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="adm-form">
      <div className="adm-form-group">
        <label className="adm-label">Product Name *</label>
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          className="adm-input"
          placeholder="Enter product name"
          disabled={isSubmitting}
        />
      </div>

      <div className="adm-form-group">
        <label className="adm-label">Category *</label>
        <input
          type="text"
          value={newProduct.category}
          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
          className="adm-input"
          placeholder="e.g., Tops, Bottoms, Outerwear"
          disabled={isSubmitting}
        />
      </div>

      <div className="adm-form-group">
        <label className="adm-label">Price ($) *</label>
        <input
          type="number"
          step="0.01"
          value={newProduct.price}
          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
          className="adm-input"
          placeholder="0.00"
          disabled={isSubmitting}
        />
      </div>

      <div className="adm-form-group">
        <label className="adm-label">Stock Quantity</label>
        <input
          type="number"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
          className="adm-input"
          placeholder="0"
          disabled={isSubmitting}
        />
      </div>

      <div className="adm-form-group">
        <label className="adm-label">Description</label>
        <textarea
          value={newProduct.description}
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          className="adm-textarea"
          rows="4"
          placeholder="Detailed product description"
          disabled={isSubmitting}
        />
      </div>

      <ImageUpload 
        handleImageUpload={handleImageUpload}
        imagePreviews={imagePreviews}
        disabled={isSubmitting}
      />

      <ChipInput
        label="Available Sizes"
        value={sizeInput}
        onChange={setSizeInput}
        onAdd={addSize}
        items={newProduct.sizes}
        onRemove={removeSize}
        placeholder="Enter size and press Enter"
        disabled={isSubmitting}
      />

      <ChipInput
        label="Available Colors"
        value={colorInput}
        onChange={setColorInput}
        onAdd={addColor}
        items={newProduct.colors}
        onRemove={removeColor}
        placeholder="Enter color and press Enter"
        disabled={isSubmitting}
      />

      <ChipInput
        label="Product Features"
        value={featureInput}
        onChange={setFeatureInput}
        onAdd={addFeature}
        items={newProduct.features}
        onRemove={removeFeature}
        placeholder="Enter feature and press Enter"
        disabled={isSubmitting}
      />

      <div className="adm-form-section">
        <h3 className="adm-section-title">Product Details</h3>
        
        <div className="adm-form-group">
          <label className="adm-label">Material</label>
          <input
            type="text"
            value={newProduct.details.material}
            onChange={(e) => setNewProduct({
              ...newProduct,
              details: { ...newProduct.details, material: e.target.value }
            })}
            className="adm-input"
            placeholder="e.g., 100% Organic Cotton"
            disabled={isSubmitting}
          />
        </div>

        <div className="adm-form-group">
          <label className="adm-label">Fit</label>
          <input
            type="text"
            value={newProduct.details.fit}
            onChange={(e) => setNewProduct({
              ...newProduct,
              details: { ...newProduct.details, fit: e.target.value }
            })}
            className="adm-input"
            placeholder="e.g., Regular Fit, Slim Fit"
            disabled={isSubmitting}
          />
        </div>

        <div className="adm-form-group">
          <label className="adm-label">Care Instructions</label>
          <input
            type="text"
            value={newProduct.details.care}
            onChange={(e) => setNewProduct({
              ...newProduct,
              details: { ...newProduct.details, care: e.target.value }
            })}
            className="adm-input"
            placeholder="e.g., Machine wash cold"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="adm-form-group">
        <label className="adm-checkbox-label">
          <input
            type="checkbox"
            checked={newProduct.isNew}
            onChange={(e) => setNewProduct({...newProduct, isNew: e.target.checked})}
            className="adm-checkbox"
            disabled={isSubmitting}
          />
          <span>Mark as New Product</span>
        </label>
      </div>

      <button 
        onClick={handleAddProduct} 
        className="adm-btn adm-btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding Product...' : 'Add Product'}
      </button>
    </div>
  );
};

export default AddProductForm;