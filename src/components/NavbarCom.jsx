import { Link } from 'react-router-dom';
import { useCart } from '../contex/cartContext';
import '../styles/componentsStyles/Navbar.css';
import { useAuth } from '../contex/authContext';

function NavbarCom() {
  const { cartCount } = useCart();
 const { currentUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">FlexyStyles</Link>
        
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        
        <div className="nav-icons">
          {/* Search Icon */}
          <div className="nav-icon">
            <svg className="icon-svg" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <span>Search</span>
          </div>
          
          {/* Account Icon */}
          <Link to="/myaccount" className="nav-icon">
            <svg className="icon-svg" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Account {currentUser?.email}</span>
          </Link>
          
          {/* Cart Icon */}
          <Link to="/cart" className="nav-icon">
            <svg className="icon-svg" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavbarCom;