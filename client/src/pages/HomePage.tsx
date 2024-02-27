import Features from "../Components/Features";
import HeroSection from "../Components/HeroSection";
import Navbar from "../Components/Navbar";
import Steps from "../Components/Steps";

export default function HomePage() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <Features/>
      <Steps/>
    </div>
  )
}
