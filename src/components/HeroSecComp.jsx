import { useNavigate } from "react-router-dom";
import "../styles/componentsStyles/HeroSec.css"

function    HeroSecComp() {
    const navigate = useNavigate();
    const handleOnclick =()=>{
        navigate("/shop");
    }
  return (
  <section className="hero-container">
            <div className="hero-content-left">
                <h1 className="hero-title">Elevate Your Style. Effortlessly.</h1>
                <p className="hero-subtitle">Discover the curated Spring '25 collection—minimal design meets maximum impact.</p>
                <button className="hero-cta-button" onClick={handleOnclick}>Explore Now</button>
            </div>
            <div className="hero-image-right">
                <img 
                    src="https://firebasestorage.googleapis.com/v0/b/wabclone-763ba.firebasestorage.app/o/products%2F1761587729775_2_New%20Project%20157%20%5BB204A96%5D.png?alt=media&token=20ac9dbd-ac88-4113-bece-797e6c4f9027" 
                    alt="Model wearing new spring collection"
                    className="hero-main-image"
                />
            </div>
        </section>
  )
}

export default HeroSecComp