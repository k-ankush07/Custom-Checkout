import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../log in/firebase";
import store from '../../images/store.png';
import Group from '../../images/Group.png';
import Frame from '../../images/Frame 106 (1).png';
import accrss from '../../images/Group 37.png';
import token from '../../images/Group 153.png';
import demo from '../../images/Group 154.png';
import more from '../../images/more1.webp';
import basic from '../../images/Layer 2.png';
import StepFirst from "./Step-First";
import StepTwo from "./Step-Two";
import StepThird from "./Step-Third";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function Store() {
    const [step, setStep] = useState(1);
    const [storeUrl, setStoreUrl] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    const [showMore, setShowMore] = useState(false);
    const [showPre, setShowPre] = useState(false);
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [loadingDemo, setLoadingDemo] = useState(false);
    const [loadingBasic, setLoadingBasic] = useState(false);

    const points = [
        "Take advantage of this 3-day free trial!",
        "Take advantage of this 3-day free trial!",
        "Take advantage of this 3-day free trial!",
        "Take advantage of this 3-day free trial!",
        "Take advantage of this 3-day free trial!",
        "Take advantage of this 3-day free trial!",
        "Take advantage of this 3-day free trial!",
    ];

    const visibleCount = 3;
    const visiblePre = 3;

    useEffect(() => {
        const email = localStorage.getItem("email");

        const publicCheckoutPages = ["/checkout", "/checkoutv2"];
        if (!email && !publicCheckoutPages.includes(location.pathname)) {
            navigate("/login", { replace: true });
        }
    }, [navigate, location.pathname]);

    const userEmail = email || localStorage.getItem("email");

    const handleNext = async () => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (step === 1) {
                if (!userEmail) {
                    setError(" User email not found. Please login.");
                    setLoading(false);
                    return;
                }

                if (!storeUrl) {
                    setError(" Please enter your store URL");
                    setLoading(false);
                    return;
                }

                const res = await axios.get(`${apiBaseUrl}/login-data`);
                const users = res.data;

                const currentUser = users.find(
                    user => (user.email || "").trim().toLowerCase() === userEmail.trim().toLowerCase()
                );

                if (currentUser) {
                    const currentShop = storeUrl.trim().toLowerCase();
                    const userShop = (currentUser.shop || "").trim().toLowerCase();

                    if (userShop === currentShop) {
                        setError(" You already added this shop.");
                        alert("You already added this shop.");
                        setLoading(false);
                        return;
                    }
                }

                setStep(2);
                setError("");
                setLoading(false);
                return;
            }

            if (step === 2) {
                const checkRes = await axios.post(`${apiBaseUrl}/check-shopify`, {
                    storeUrl,
                    accessToken,
                });

                if (!checkRes.data.success) {
                    setError(" Invalid Store URL or Access Token");
                    setLoading(false);
                    return;
                }

                const userEmail = localStorage.getItem("email");
                if (!userEmail) {
                    setError(" User email not found. Please login again.");
                    setLoading(false);
                    return;
                }

                const updateRes = await axios.post(`${apiBaseUrl}/update-shopify`, {
                    email: userEmail,
                    shop: storeUrl,
                    accessToken,
                });

                if (updateRes.data.message) {
                    setStep(3);
                    setError("");
                }
            }

            setLoading(false);
        } catch (err) {
            console.error("Error in handleNext:", err);
            setError("Something went wrong");
            setLoading(false);
        }
    };

    const handleFinish = async () => {
        if (!storeUrl || !accessToken) return;
        localStorage.setItem("shop", storeUrl);
        localStorage.setItem("accessToken", accessToken);

        try {
            const email = localStorage.getItem("email");
            if (!email) {
                alert("User email not found, please login again.");
                navigate("/login", { replace: true });
                return;
            }

            const paymentResponse = await axios.get(`${apiBaseUrl}/payment-data`, {
                params: { shop: storeUrl, email }
            });
            const subscriptions = paymentResponse.data || [];

            const matchedSubscription = subscriptions.find(
                (sub) =>
                    sub.subscription_status === "active" ||
                    sub.subscription_status === "trialing"
            );

            return matchedSubscription;

        } catch (err) {
            console.error("Error checking subscription:", err);
            alert("Something went wrong while checking subscription.");
            return null;
        }
    };

    useEffect(() => {
        if (location.state?.resetStep) {
            setStep(1);
            setStoreUrl("");
            setAccessToken("");
            return;
        }

        const checkExistingShop = async () => {
            const userEmail = localStorage.getItem("email");
            if (!userEmail) {
                navigate("/login", { replace: true });
                return;
            }

            try {
                const res = await axios.get(`${apiBaseUrl}/login-data`);
                const users = res.data;

                const currentUser = users.find(
                    user =>
                        (user.email || "").trim().toLowerCase() ===
                        userEmail.trim().toLowerCase()
                );

                if (currentUser && currentUser.shop && currentUser.accessToken) {
                    setStoreUrl(currentUser.shop);
                    setAccessToken(currentUser.accessToken);
                    setStep(3);
                }
            } catch (err) {
                console.error("Error fetching login data:", err);
            }
        };

        checkExistingShop();
    }, [navigate, location.state]);

    const handleBasic = async () => {
        setLoadingBasic(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const subscription = await handleFinish();
        setLoadingBasic(false);
        if (subscription) navigate("/dashboard");
        else navigate("/payment");
    };

    const priceId = "price_1S2QQfBlShzYsECH2TPFxnSG";
    const shopCorrect = localStorage.getItem("shop");

    const handleFreeTrial = async () => {
        setLoadingDemo(true);
        const shop = shopCorrect || storeUrl;
        const email = localStorage.getItem("email");

        if (!shop || !email || !priceId) {
            setLoadingDemo(false);
            return alert("Shop, email, and priceId are required.");
        }

        try {
            const res = await fetch(`${apiBaseUrl}/create-subscription`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shop, email, priceId, trial: true }),
            });

            const data = await res.json();
            if (data.error) {
                setLoadingDemo(false);
                return alert(data.error);
            }

            const subRes = await fetch(`${apiBaseUrl}/payment-data?shop=${shop}&email=${email}`);
            const subs = await subRes.json();
            const trialSub = subs.find(s => s.trial_start !== null || s.subscription_status === "trialing");

            if (!trialSub) {
                setLoadingDemo(false);
                return alert("Trial could not be confirmed. Please try again.");
            }

            const subscription = await handleFinish();
            setLoadingDemo(false);
            if (subscription) navigate("/dashboard");
            else navigate("/payment");

        } catch (err) {
            console.error(err);
            setLoadingDemo(false);
            alert("Error starting trial");
        }
    };

    const handleLogout = async () => {
        localStorage.clear();
        await signOut(auth);
        navigate("/login", { replace: true });
    };

    return (
        <div className="checkout-login-page store">
            <div className="wrapper">
                <div className="checkout-sign-up">
                    <div className="checkout-sign-up-wrapp">
                        <div className="checkout-details-options">
                            <div className={`step-item first ${step === 1 ? "active" : "default-class"}`}>STORE URL</div>
                            <div className={`step-item second ${step === 2 ? "active" : "default-class"}`}>ACCESS TOKEN</div>
                            <div className={`step-item third ${step === 3 ? "active" : "default-class"}`}>Store Plan</div>
                        </div>
                        <StepFirst
                            step={step}
                            store={store}
                            Group={Group}
                            storeUrl={storeUrl}
                            setStoreUrl={setStoreUrl}
                            setError={setError}
                            error={error}
                            handleNext={handleNext}
                            Frame={Frame}
                            loading={loading}
                        />
                        <StepTwo
                            step={step}
                            token={token}
                            accrss={accrss}
                            accessToken={accessToken}
                            setAccessToken={setAccessToken}
                            error={error}
                            handleNext={handleNext}
                            Frame={Frame}
                            loading={loading}
                        />
                        <StepThird
                            step={step}
                            demo={demo}
                            points={points}
                            showMore={showMore}
                            visibleCount={visibleCount}
                            setShowMore={setShowMore}
                            more={more}
                            handleFreeTrial={handleFreeTrial}
                            basic={basic}
                            showPre={showPre}
                            visiblePre={visiblePre}
                            setShowPre={setShowPre}
                            handleBasic={handleBasic}
                            loading={loading}
                            loadingDemo={loadingDemo}
                            loadingBasic={loadingBasic}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}