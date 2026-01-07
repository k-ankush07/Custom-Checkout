import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { CardNumberElement, CardExpiryElement, CardCvcElement, } from "@stripe/react-stripe-js";
import AllowedCountries from "../checkout-V1/Countries";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const stripePromise = loadStripe("pk_test_mkrgIEP3VV4XgdE5OzbaeP6z00yXZXyuOz");

function SubscriptionForm({ priceId }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [customerInfo, setCustomerInfo] = useState({
        name: "", email: "",
        line1: "", city: "", state: "", postalCode: "", country: "IN",
    });
    const [trialAvailable, setTrialAvailable] = useState(true);
    const shop = localStorage.getItem("shop");
    const email = localStorage.getItem("email");
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            try {
                const res = await fetch(`${apiBaseUrl}/payment-data?shop=${shop}&email=${email}`);
                const data = await res.json();

                if (!Array.isArray(data)) return;

                const activeSubscription = data.some(
                    (item) =>
                        item.status === "active" ||
                        item.status === "trialing" ||
                        item.subscription_status === "active" ||
                        item.subscription_status === "trialing"
                );

                if (activeSubscription && !location.state?.skipRedirect) {
                    navigate("/dashboard");
                    return;
                }

                const trialUsed = data.some((item) => item.trial_start !== null);
                setTrialAvailable(!trialUsed);
            } catch (err) {
                console.error("Error checking subscription:", err);
            }
        };

        checkSubscriptionStatus();
    }, [shop, email, navigate, location.state]);

    const handleChange = (e) => {
        setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
    };


    const handleSubscription = async (trial = false) => {
        if (trial && !trialAvailable) {
            alert("Free trial is available only once per shop/email.");
            return;
        }

        setLoading(true);
        let paymentMethodId = null;

        if (!trial) {
            if (!stripe || !elements) {
                setLoading(false);
                return;
            }

            const cardNumber = elements.getElement(CardNumberElement);
            if (!cardNumber) {
                setLoading(false);
                return alert("Card element not found.");
            }

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardNumber,
                billing_details: {
                    name: customerInfo.name,
                    email: email,
                    address: {
                        line1: customerInfo.line1,
                        city: customerInfo.city,
                        state: customerInfo.state,
                        postal_code: customerInfo.postalCode,
                        country: customerInfo.country,
                    },
                },
            });

            if (error) {
                setLoading(false);
                return alert(error.message);
            }

            paymentMethodId = paymentMethod.id;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const res = await fetch(`${apiBaseUrl}/create-subscription`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shop,
                    email,
                    priceId,
                    trial,
                    paymentMethodId,
                    billing: customerInfo,
                }),
            });

            const data = await res.json();
            setLoading(false);

            if (data.error) return alert("Subscription error: " + data.error);

            alert(data.message);
            navigate("/dashboard");
        } catch (err) {
            console.error("Subscription error:", err);
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <div className="checkout-login-page subscription">
                <div className="wrapper">
                <div className="checkout-sign-up">
                    <div className="checkout-sign-up-wrapp">
                        <div className="login-page-logo card"><h2>Subsciption</h2>
                            <span className="description-card">Your free trial ends on 1 September 2025.</span>
                            <span className="description-card">To continue, please enter your payment details.</span>
                        </div>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="checkout-page-sign card">
                                <label>Card Number</label>
                                <div className="card-input payment-card">
                                    <CardNumberElement options={{
                                        placeholder: "Card Number", style: {
                                            base: { fontSize: "15px", color: "#000", },
                                            invalid: { color: "#fa755a" }
                                        }
                                    }}
                                    />
                                </div>
                                <div className="card-row payment">
                                    <div className="payment-card-option">
                                        <label>Expiration Date</label>
                                        <div className="payment-card">
                                            <CardExpiryElement
                                                options={{
                                                    placeholder: "MM / YY", style: {
                                                        base: { fontSize: "15px", color: "#000", },
                                                        invalid: { color: "#fa755a" }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="payment-card-option">
                                        <label>Security Code</label>
                                        <div className="payment-card">
                                            <CardCvcElement
                                                options={{
                                                    placeholder: "3-digit CVV", style: {
                                                        base: { fontSize: "15px", color: "#000", },
                                                        invalid: { color: "#fa755a" }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="payment-card-option">
                                    <label>Name on card</label>
                                    <div className="payment-card">
                                        <input type="text" name="name"
                                            value={customerInfo.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Full Name as on card" />
                                    </div>
                                </div>
                                <div className="payment-card-option">
                                    <label>Address</label>
                                    <div className="payment-card">
                                        <input type="text" name="line1"
                                            value={customerInfo.line1}
                                            onChange={handleChange}
                                            required
                                            placeholder="Address"
                                        />
                                    </div>
                                </div>
                                <div className="card-row payment">
                                    <div className="payment-card-option">
                                        <label>Country</label>
                                        <div className="payment-card select">
                                            <select name="country"
                                                value={customerInfo.country}
                                                onChange={handleChange}
                                                required >
                                                {AllowedCountries.map((c) => (
                                                    <option key={c.code} value={c.code}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="payment-card-option">
                                        <label>Pin Code</label>
                                        <div className="payment-card">
                                            <input type="text" name="postalCode" placeholder="Postal Code"
                                                value={customerInfo.postalCode}
                                                onChange={handleChange} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-row payment">
                                    <div className="payment-card-option">
                                        <label>state</label>
                                        <div className="payment-card">
                                            <input type="text" name="state"
                                                value={customerInfo.state}
                                                onChange={handleChange}
                                                required
                                                placeholder="State"
                                            />
                                        </div>
                                    </div>
                                    <div className="payment-card-option">
                                        <label>city</label>
                                        <div className="payment-card">
                                            <input type="text" name="city" placeholder="city"
                                                value={customerInfo.city}
                                                onChange={handleChange} required />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="btn-login"
                                    type="button"
                                    onClick={() => handleSubscription(false)}
                                    disabled={loading}>
                                    {loading ? (<>
                                        <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                    </>
                                    ) : (
                                        "Pay Now"
                                    )}
                                </button>

                                <div className="payment-detils">
                                    <p> 3 days free, then $14.99 monthly starting 1 September 2025. You can cancel anytime before then.</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default function App() {
    return (
        <Elements stripe={stripePromise}>
            <SubscriptionForm priceId="price_1S2QQfBlShzYsECH2TPFxnSG" />
        </Elements>
    );
}