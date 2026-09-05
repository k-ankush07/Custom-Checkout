import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useShopify } from "../main-dashboard/dashboard-Pages/ShopifyContext";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function PaymentCheck() {
    const { shop: contextShop, email, accessToken } = useShopify();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkPayment = async () => {
            const skipPaths = ["/login", "/payment", "/details", "/reset-password", "/admin", "/checkout", "/checkoutv2"];
            const shouldSkip = location.pathname === "/" || skipPaths.some(path => location.pathname.startsWith(path));
            if (shouldSkip) return;

            const shop = contextShop || localStorage.getItem("shop");
            const email = localStorage.getItem("email");
            const token = accessToken || localStorage.getItem("accessToken");

            if (!email || !shop || !token) {
                console.log("User not logged in or shop missing, redirecting to /login");
                navigate("/login", { replace: true });
                return;
            }

            try {
                const response = await axios.get(`${apiBaseUrl}/payment-data`, { params: { shop, email } });
                const subscription = response.data?.[0];

                if (!subscription) {
                    console.log("No subscription found, redirecting to /payment");
                    navigate("/payment");
                    return;
                }

                const status = (subscription.subscription_status || "").trim().toLowerCase();
                const TRIAL_DURATION_MINUTES = 60 * 24 * 3;
                
                console.log(TRIAL_DURATION_MINUTES)
                if (status === "active") {
                    return;
                }

                if (status === "trialing") {
                    if (!subscription.trial_start) {
                        console.log("No trial start date, redirecting to /payment");
                        navigate("/payment");
                        return;
                    }

                    const trialStart = new Date(subscription.trial_start);
                    const now = new Date();
                    const diffMinutes = (now - trialStart) / 1000 / 60;

                    if (diffMinutes > TRIAL_DURATION_MINUTES) {
                        console.log("Trial expired, updating subscription status in DB");

                        try {
                            const response = await axios.post(`${apiBaseUrl}/update-subscription-status`, {
                                subscriptionId: subscription.subscription_id,
                                newStatus: "trial_expired",
                                shop,
                                email,
                            });

                            console.log("Update response:", response.data);
                        } catch (err) {
                            console.error("Failed to update subscription status:", err);
                        }

                        navigate("/payment");
                        return;
                    }

                    return;
                }

                console.log("Unknown subscription status, redirecting to /payment");
                navigate("/payment");

            } catch (error) {
                console.error("Error fetching subscription data:", error);
                navigate("/payment");
            }
        };

        checkPayment();
    }, [contextShop, navigate, apiBaseUrl, location.pathname]);

    return null;
}