import "../styles/componentsStyles/LimitedOffer.css"
import { useCart } from '../contex/cartContext';
import {allProducts} from "../pages/ShopPage"
import { Link, useNavigate } from "react-router-dom";
import { getLimitedOfferProducts } from "../services/productsServices";
import { useEffect, useState } from "react";
import { useAuth } from "../contex/authContext";
function LimitedOfferComp() {
    const { addToCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [limitedOffer,setLimitedOffer] = useState([])

 useEffect(() => {
      const fetchProducts = async () => {
        try {
          const products = await getLimitedOfferProducts();
          setLimitedOffer(products);
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

  return (
    <section className="limited-offer">
      <h2>Limited Time Offers</h2>
      <div className="offer-timer">
          <div className="timer-unit">
            <span className="timer-value">12</span>
            <span className="timer-label">Hours</span>
          </div>
          <div className="timer-unit">
            <span className="timer-value">34</span>
            <span className="timer-label">Minutes</span>
          </div>
          <div className="timer-unit">
            <span className="timer-value">56</span>
            <span className="timer-label">Seconds</span>
          </div>
        </div>
      <div className="offer-grid">
        {limitedOffer.map(offer => (
          <div key={offer.id} className="offer-card">
            <span className="badge">SALE</span>
            <Link key={offer.id} to={`/productdetail/${offer.id}`} className="shop-product-link">
            <div className="offer-image"> 
              <img src={offer.images[0]} alt={offer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              </div>
            <h3>{offer.name}</h3>
            <div className="price-group">
              <span className="old-price">${offer.oldPrice}</span>
              <span className="sale-price">${offer.price}</span>
            </div>
            </Link>
            <button 
              className="add-button"
              onClick={() => addToCart(offer)}
              >
              Add to Cart
            </button><button 
              className="add-button"
              onClick={() => handleBuyNow(offer)}
              >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default LimitedOfferComp