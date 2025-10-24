import "../styles/componentsStyles/Footer.css"

function FooterComp() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About Us</h4>
          <p>Your destination for premium fashion</p>
        </div>
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li>Contact Us</li>
            <li>Shipping Info</li>
            <li>Returns</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <ul>
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Twitter</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 FlexyStyles. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default FooterComp