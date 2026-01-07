import { useState, useEffect } from "react";
import whiteSubscription from '../../../../images/white-Subscription.webp';
import { useNavigate } from "react-router-dom";
import { useShopify } from "../ShopifyContext";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function SettingSubscription({ paymentData, formatDate, getEndDate }) {

    const navigate = useNavigate();
    const { allOrders, shop: contextShop, } = useShopify();
    const shop = contextShop || localStorage.getItem("shop");
    const email = localStorage.getItem("email");
    const [loading, setLoading] = useState(false);

    const handleCancelSubscription = async () => {
        setLoading(true);
        setTimeout(async () => {
            if (!shop && !email) {
                alert("No shop or email found.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${apiBaseUrl}/cancel-subscription`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ shop, email }),
                });

                const data = await res.json();
                if (data.error) alert("Error: " + data.error);
                else {
                    navigate("/payment");
                }
            } catch (err) {
                console.error("Cancel subscription error:", err);
                alert("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        }, 3000);
    };

    const handleUpgrade = () => {
        setLoading(true);
        setTimeout(() => {
            navigate("/payment", { state: { skipRedirect: true } });
            setLoading(false);
        }, 3000);
    };

    return (
        <div className="checkout-setting-wrp">
            <div className="checkout-setting-navgate">
                <p><span>Settings/</span>Subscription</p>
            </div>
            <div className="checkout-setting-webp">
                <div className="checkout-img active account">
                    <img src={whiteSubscription} alt="" />
                </div>
                <div className="setting-title">
                    <p>Subscription</p>
                </div>
            </div>
            {paymentData ? (
                <>
                    <div className="checkout-setting-account-form subscription">
                        <table className="subscription-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Current Plan</th>
                                    <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Start Date</th>
                                    <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>End Date</th>
                                    <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: "10px" }}>
                                        {paymentData.subscription_status === "active"
                                            ? "Paid"
                                            : paymentData.subscription_status === "trialing"
                                                ? "Free Trial"
                                                : "Free"}
                                    </td>
                                    <td style={{ padding: "10px" }}>{formatDate(paymentData.start_date || paymentData.trial_start)}</td>
                                    <td style={{ padding: "10px" }}>{getEndDate(paymentData)}</td>
                                    <td style={{ padding: "10px" }}>
                                        {paymentData.subscription_status || (paymentData.trial_start ? "Trialing (3 days)" : "Free")}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        {loading ? (
                            <button className="btn-subscription" disabled>
                                <i className="fa fa-spinner fa-spin" ></i>
                            </button>
                        ) : paymentData.subscription_status === "active" ? (
                            <button className="btn-subscription" onClick={handleCancelSubscription}>
                                Cancel Subscription
                            </button>
                        ) : (
                            <button className="btn-subscription" onClick={handleUpgrade}>
                                Upgrade
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <p>No subscription data found.</p>
            )}
        </div>
    );
}
