import { useEffect, useReducer } from "react";
import Features from "../Components/Features";
import HeroSection from "../Components/HeroSection";
import Navbar from "../Components/Navbar";
import Steps from "../Components/Steps";
import { initialState, reducer } from "../context";
import Cookies from 'js-cookie'

export default function HomePage() {
  const [{ user }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const userLocal = localStorage.getItem("userInfo");
    const userIdLocal = localStorage.getItem("userId");

    if (userLocal && userIdLocal) {
      const parsedUser = JSON.parse(userLocal);
      dispatch({ type: "USER_SIGNIN", payload: parsedUser });
      window.location.href = `${parsedUser._id}/dashboard`;
    } else {
      const userCookie = Cookies.get("userInfo");
      const userIdCookie = Cookies.get("userId");

      if (userCookie && userIdCookie) {
        localStorage.setItem("userInfo", userCookie.slice(2));
        localStorage.setItem("userId", userIdCookie.slice(3, -1));
        dispatch({ type: "USER_SIGNIN", payload: JSON.parse(userCookie) });
        window.location.href = `${JSON.parse(userCookie)._id}/dashboard`;
      }
    }
  }, [user]);
  console.log(localStorage.getItem('userId'))

  
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
