import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShopify } from "../main-dashboard/dashboard-Pages/ShopifyContext";
import axios from "axios";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function CheckoutGuard({ children }) {
  const { shop, email } = useShopify();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
     
      try {
        const response = await axios.get(`${apiBaseUrl}/payment-data`, { params: { shop, email } });
        const subscription = response.data?.[0];

        if (!subscription) {
          navigate("/payment", { replace: true });
        } else if (subscription.subscription_status === "active" || subscription.subscription_status === "trialing") {
          setLoading(false);
        } else {
          navigate("/payment", { replace: true });
        }
      } catch (err) {
        console.error(err);
        navigate("/payment", { replace: true });
      }
    };

    checkAccess();
  }, [shop, email, navigate]);

  if (loading) return null; 

  return children;
}