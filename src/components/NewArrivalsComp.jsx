import "../styles/componentsStyles/NewArrivals.css"
import { useCart } from '../contex/cartContext';
import { useAuth } from '../contex/authContext';
import { Link, useNavigate } from "react-router-dom";
import { getNewArrivalProducts } from "../services/productsServices"
import { useEffect, useState } from "react";

function NewArrivalsComp() {
    const { addToCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [newArrival, setnewArrival] = useState([]);
    const [loading, setLoading] = useState(true);
   
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const products = await getNewArrivalProducts();
          setnewArrival(products);
        } catch (err) {
          console.error("Error fetching products:", err);
        } finally {
          setLoading(false);
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
        <section className="new-arrivals">
            <h2>New Arrivals</h2>
            <div className="product-grid">
                {newArrival.map(product => (
                  <div key={product.id} className="product-card">
                      <Link to={`/productdetail/${product.id}`} className="shop-product-link">
                        <div className="product-image">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <h3>{product.name}</h3>
                        <p className="price">₹{product.price}</p>
                      </Link>
                      <div className="button-container">
                        <button
                            className="add-button"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                        <button
                            className="add-button buy-now-button"
                            onClick={() => handleBuyNow(product)}
                        >
                            Buy Now
                        </button>
                      </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default NewArrivalsComp;