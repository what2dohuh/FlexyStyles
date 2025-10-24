import { use } from "react"
import "../styles/componentsStyles/Banner.css"
import { useNavigate } from "react-router-dom"

function BannerComp() {
  const navigate = useNavigate()
  const handleOnclick = () => {
    navigate("/shop")
  }
  return (
    <>
     <section className="banner">
      <div className="banner-content">
        <h1>Spring Collection 2025</h1>
        <p>Discover the latest trends in fashion</p>
        <button className="cta-button" onClick={handleOnclick}>Shop Now</button>
      </div>
    </section>
    </>
  )
}

export default BannerComp