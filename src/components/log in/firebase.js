import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsbIuLoGpiBbpdJFWZGu6WPXURyq0oaKc",
  authDomain: "custom-checkout-b9c69.firebaseapp.com",
  projectId: "custom-checkout-b9c69",
  storageBucket: "custom-checkout-b9c69.appspot.com",
  messagingSenderId: "1069074042221",
  appId: "1:1069074042221:web:5ad7ff198a30038ed69e64",
  measurementId: "G-KPNKCJ9CEB"
};

const app = initializeApp(firebaseConfig);

getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();