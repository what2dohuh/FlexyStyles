import "../styles/pagesStyles/Home.css"
import NewArrivalsComp from "../components/NewArrivalsComp";
import BannerComp from "../components/BannerComp";
import LimitedOfferComp from "../components/LimitedOfferComp";
import FooterComp from "../components/FooterComp";
import NavbarCom from "../components/NavbarCom";
import HeroSecComp from "../components/HeroSecComp";

function HomePage() {

  return (
  <>
    <NavbarCom />
    <BannerComp />
    <NewArrivalsComp  />
    <HeroSecComp/>
    {/* <LimitedOfferComp  /> */}
    <FooterComp />
    </>
  )
}

export default HomePage