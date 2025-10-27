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
  const [allProducts, setAllProduct] = useState([])
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleBuyNow = (product) => {
    if (!currentUser) {
      alert('Please login to continue with purchase');
      navigate('/login', { state: { from: '/shop' } });
      return;
    }

    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      quantity: 1,
      selectedSize: product.sizes?.[0] || 'N/A',
      selectedColor: product.colors?.[0] || 'N/A',
    };

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

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImage(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImage(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <NavbarCom />
      <div className="product-detail-container">
        <div className="product-content">
          {/* Left Side - Images */}
          <div className="product-images">
            <div className="main-image-container" onClick={handleImageClick}>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="main-image"
              />
              <div className="zoom-hint">Click to enlarge</div>
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
              <button className="btn-primary" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
              <button className="btn-secondary" onClick={() => handleBuyNow(product)}>
                Buy Now
              </button>
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

      {/* Image Modal */}
      {isModalOpen && (
        <div className="image-modal" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleModalClose}>
              ×
            </button>
            {product.images.length > 1 && (
              <>
                <button className="modal-nav prev" onClick={handlePrevImage}>
                  ‹
                </button>
                <button className="modal-nav next" onClick={handleNextImage}>
                  ›
                </button>
              </>
            )}
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="modal-image"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ProductDetailPage;