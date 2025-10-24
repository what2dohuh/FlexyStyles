import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/pagesStyles/ProductDetail.css"
import { useCart } from "../contex/cartContext";
import NavbarCom from "../components/NavbarCom";
import { getAllProducts } from "../services/productsServices";
import { useAuth } from "../contex/authContext";
import LoadingComp from "../components/LoadingComp";

function ProductDetailPage() {
  const { addToCart } = useCart();
  const [allProducts,setAllProduct] = useState([])
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
      const fetchProducts = async () => {
        try {
          const products = await getAllProducts();
          setAllProduct(products);
        } catch (err) {
          console.error("Error fetching products:", err);
        } 
      };

      fetchProducts();
    }, []);
        const handleBuyNow = (product) => {
          // Check if user is logged in
      if (!currentUser) {
        alert('Please login to continue with purchase');
        navigate('/login', { state: { from: '/shop' } });
        return;
      }

      // Prepare the item data for Buy Now checkout
      const buyNowItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        quantity: 1, // Default quantity is 1
        selectedSize: product.sizes?.[0] || 'N/A', // Default to first size if available
        selectedColor: product.colors?.[0] || 'N/A', // Default to first color if available
      };

      // Navigate to checkout with the item data
      navigate('/checkout', { 
        state: { buyNowItem } 
      });
    };
    const { id } = useParams();
    const product = allProducts.find(p => p.id === id);
    if (!product) return <LoadingComp/>;

  const handleQuantityChange = (type) => {
    if (type === 'increment') {
      setQuantity(q => q + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  return (
    <>
    <NavbarCom />
    <div className="product-detail-container">
      <div className="product-content">
        {/* Left Side - Images */}
        <div className="product-images">
          <div className="main-image-container">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className={`main-image ${isZoomed ? 'zoomed' : ''}`}
              onClick={() => setIsZoomed(!isZoomed)}
              />
            {isZoomed && <div className="zoom-hint">Click to zoom out</div>}
          </div>
          <div className="thumbnail-container">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
                />
            ))}
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="product-info">
          <div className="product-header">
            <h1 className="product-name">{product.name}</h1>
            <div className="product-rating">
              <div className="stars">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="reviews">({product.reviews} reviews)</span>
            </div>
            <p className="product-price">₹{product.price.toFixed(2)}</p>
          </div>

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          {/* Size Selection */}
          <div className="selection-group">
            <label className="selection-label">Select Size</label>
            <div className="size-options">
              {product.sizes.map(size => (
                <button
                key={size}
                className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="selection-group">
            <label className="selection-label">Quantity</label>
            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange('decrement')}>−</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange('increment')}>+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-primary" onClick={()=>addToCart(product)}>Add to Cart</button>
            <button className="btn-secondary" onClick={() => handleBuyNow(product)}>Buy Now</button>
          </div>

          {/* Features */}
          <div className="product-features">
            <h3>Key Features</h3>
            <ul>
              {product.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <h3>Product Details</h3>
            <div className="details-grid">
              {Object.entries(product.details).map(([key, value]) => (
                <div key={key} className="detail-item">
                  <span className="detail-key">{key.toUpperCase()}:</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default ProductDetailPage