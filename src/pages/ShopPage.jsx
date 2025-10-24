import { useEffect, useState } from "react";
import "../styles/pagesStyles/Shop.css"
import { useCart } from "../contex/cartContext";
import { Link } from "react-router-dom";
import NavbarCom from "../components/NavbarCom";
import {getAllProducts} from "../services/productsServices"

export const allProducts = [
  {
    id: 1,
    name: 'Premium Cotton T-Shirt',
    category: 'Tops',
    price: 49.99,
    rating: 4.5,
    reviews: 128,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Navy', 'Gray'],
    description: 'Experience ultimate comfort with our premium cotton t-shirt. Crafted from 100% organic cotton, this essential piece combines timeless style with exceptional quality. Perfect for everyday wear.',
    features: [
      '100% organic cotton fabric',
      'Breathable and moisture-wicking',
      'Reinforced stitching for durability',
      'Pre-shrunk to maintain size',
      'Machine washable'
    ],
    details: {
      sku: 'TS-2024-001',
      material: '100% Organic Cotton',
      fit: 'Regular Fit',
      care: 'Machine wash cold, tumble dry low'
    },
    isNew: true
  },
  {
    id: 2,
    name: 'Black Leather Jacket',
    category: 'Outerwear',
    price: 299.99,
    rating: 4.8,
    reviews: 245,
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1526171117174-4d8ecf77b111?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1526172228288-4d8ecf77b222?w=600&h=800&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    description: 'A timeless black leather jacket that adds bold style to any outfit. Made with genuine leather for durability and comfort.',
    features: [
      'Premium genuine leather',
      'Zipper front closure',
      'Multiple secure pockets',
      'Durable inner lining',
      'Classic biker style'
    ],
    details: {
      sku: 'JKT-2024-002',
      material: '100% Leather',
      fit: 'Slim Fit',
      care: 'Dry clean only'
    },
    isNew: false
  },
  {
    id: 3,
    name: 'Summer Floral Dress',
    category: 'Dresses',
    price: 129.99,
    rating: 4.6,
    reviews: 189,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1526171117174-4d8ecf77b111?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1526174449697-4d8ecf77b444?w=600&h=800&fit=crop',
      
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Red', 'Blue', 'Yellow'],
    description: 'Lightweight and breezy summer dress with a floral print design, perfect for sunny days and casual outings.',
    features: [
      'Soft breathable fabric',
      'Floral print design',
      'Adjustable straps',
      'Lightweight and airy',
      'Machine washable'
    ],
    details: {
      sku: 'DRS-2024-003',
      material: 'Polyester Blend',
      fit: 'Relaxed Fit',
      care: 'Machine wash cold'
    },
    isNew: true
  }
];


function ShopPage() {

 const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('featured');
  const [showNewOnly, setShowNewOnly] = useState(false);
  const { handleAddToCart } = useCart();
  const [allProducts,setAllProduct] = useState([])
  
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
  // Filter Products
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }

    // Price filter
    if (priceRange.min && product.price < parseFloat(priceRange.min)) {
      return false;
    }
    if (priceRange.max && product.price > parseFloat(priceRange.max)) {
      return false;
    }

    // New arrivals filter
    if (showNewOnly && !product.isNew) {
      return false;
    }

    return true;
  });

  // Sort Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-az':
        return a.name.localeCompare(b.name);
      case 'name-za':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setShowNewOnly(false);
    setSortBy('featured');
  };

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear'];

  return (
    <>
    <NavbarCom />
    <div className="shop-page-container">
      <div className="shop-page-header">
        <h1 className="shop-page-title">Shop All</h1>
        <p className="shop-page-subtitle">Discover our complete collection of premium fashion</p>
      </div>

      <div className="shop-layout-wrapper">
        {/* Sidebar Filters */}
        <aside className="shop-filters-sidebar">
          <div className="shop-filter-section">
            <h3 className="shop-filter-heading">CATEGORY</h3>
            <div className="shop-filter-options-list">
              {categories.map(category => (
                <div key={category} className="shop-filter-checkbox-wrapper">
                  <input
                    type="checkbox"
                    id={`shop-category-${category}`}
                    className="shop-filter-checkbox-input"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    />
                  <label htmlFor={`shop-category-${category}`} className="shop-filter-checkbox-label">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="shop-filter-section">
            <h3 className="shop-filter-heading">PRICE RANGE</h3>
            <div className="shop-price-range-inputs">
              <input
                type="number"
                placeholder="Min"
                className="shop-price-input-field"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
              <span className="shop-price-separator">-</span>
              <input
                type="number"
                placeholder="Max"
                className="shop-price-input-field"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
            </div>
          </div>

          <div className="shop-filter-section">
            <h3 className="shop-filter-heading">FILTERS</h3>
            <div className="shop-filter-options-list">
              <div className="shop-filter-checkbox-wrapper">
                <input
                  type="checkbox"
                  id="shop-new-arrivals"
                  className="shop-filter-checkbox-input"
                  checked={showNewOnly}
                  onChange={(e) => setShowNewOnly(e.target.checked)}
                  />
                <label htmlFor="shop-new-arrivals" className="shop-filter-checkbox-label">
                  New Arrivals
                </label>
              </div>
            </div>
          </div>

          <button className="shop-clear-filters-btn" onClick={clearAllFilters}>
            CLEAR ALL FILTERS
          </button>
        </aside>

        {/* Main Content */}
        <main className="shop-products-main">
          <div className="shop-controls-bar">
            <div className="shop-product-count-text">
              {sortedProducts.length} Products
            </div>
            <div className="shop-sort-dropdown-wrapper">
              <label htmlFor="shop-sort" className="shop-sort-label">Sort by:</label>
              <select
                id="shop-sort"
                className="shop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A-Z</option>
                <option value="name-za">Name: Z-A</option>
              </select>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="shop-no-products-message">
              No products found. Try adjusting your filters.
            </div>
          ) : (
            <div className="shop-products-grid">
              {sortedProducts.map(product => (
                <Link key={product.id} to={`/productdetail/${product.id}`} className="shop-product-link">
      <div className="shop-product-card">
        <div className="shop-product-img-wrapper">
          <img
            src={product.images[0]}
            alt={product.name}
            className="shop-product-image"
            />
          {product.isNew && <span className="shop-product-badge">NEW</span>}
          {product.originalPrice && <span className="shop-product-badge">SALE</span>}
        </div>
        <div className="shop-product-details">
          <div className="shop-product-category-tag">{product.category}</div>
          <h3 className="shop-product-name">{product.name}</h3>
          <div className={`shop-product-price-wrapper ${product.originalPrice ? 'shop-product-price-sale' : ''}`}>
            ₹{product.price}
            {product.originalPrice && (
              <span className="shop-original-price">₹{product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
    </>
  )
}

export default ShopPage