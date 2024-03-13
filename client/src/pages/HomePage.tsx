import { useReducer } from "react";
import Features from "../Components/Features";
import HeroSection from "../Components/HeroSection";
import Navbar from "../Components/Navbar";
import Steps from "../Components/Steps";
import { initialState, reducer } from "../context";

export default function HomePage() {
  const [state, ] = useReducer(reducer, initialState)
  const user = state.user
  
  if (!user._id) {
    return (
      <div>
        <Navbar />
        <HeroSection />
        <Features />
        <Steps />
      </div>
    );
  } else {
    window.location.href = `${user._id}/dashboard`;
  }
}
