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
                    src="https://res.cloudinary.com/debysr2dg/image/upload/v1712653619/cld-sample-5.jpg" 
                    alt="Model wearing new spring collection"
                    className="hero-main-image"
                />
            </div>
        </section>
  )
}

export default HeroSecComp