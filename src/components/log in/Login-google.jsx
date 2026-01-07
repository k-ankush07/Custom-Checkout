import React, { useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import google from '../../images/google.png'
export default function Google({ onLogin }) {
  
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (onLogin) onLogin(result.user);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="login-google"
      onClick={handleGoogleLogin} >
      <img src={google} alt="" className="checkout-google" />
      <p>Sign in with Google</p>
    </div>
  );
}
