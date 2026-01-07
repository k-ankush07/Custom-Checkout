import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShopify } from "./ShopifyContext";

export default function Checkout() {
    const { selectedOption, handleSelect, shop, apiBaseUrl } = useShopify();
    const [activeOption, setActiveOption] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedOption) setActiveOption(selectedOption);
    }, [selectedOption]);

    const handleSetupClick = async () => {
        if (!activeOption) {
            alert("Please select an option first.");
            return;
        }
        
        if (activeOption === "basic") navigate("/dashboard/checkout");
        else if (activeOption === "pro") navigate("/dashboard/checkoutv2");

        try {
            const payloadCheckoutV2 = {
                shop,
                checkout_option: activeOption === "pro" ? "pro" : null,
            };
            const payloadCustomData = {
                shop,
                checkout_option: activeOption === "basic" ? "basic" : null,
            };

            const [resCheckoutV2, resCustomData] = await Promise.all([
                fetch(`${apiBaseUrl}/checkoutV2/option`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payloadCheckoutV2),
                }),
                fetch(`${apiBaseUrl}/custom-data/option`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payloadCustomData),
                }),
            ]);

            console.log("✅ Response /checkoutV2/option:", await resCheckoutV2.json());
            console.log("✅ Response /custom-data/option:", await resCustomData.json());
        } catch (err) {
            console.error("❌ Fetch/network error:", err);
        }
    };

    return (
        <div className="bashboard-checkout-sections">
            <div className="checkout-popup">
                <div className="checkout-popup-wrap">
                    <div className="checkout-icon">Icon</div>
                    <div className="checkout-options">
                        <div
                            className={`checkout-option basic ${activeOption === "basic" ? "selected" : ""}`}
                            onClick={() => {
                                setActiveOption("basic");
                                handleSelect("basic");
                            }}
                        >
                            <p>SHOPIFY BASIC</p>
                        </div>
                        <div
                            className={`checkout-option pro ${activeOption === "pro" ? "selected" : ""}`}
                            onClick={() => {
                                setActiveOption("pro");
                                handleSelect("pro");
                            }}
                        >
                            <p>Pro CRO BASED</p>
                        </div>
                    </div>
                    <div className="setup-btn" onClick={handleSetupClick}>
                        SETUP NOW
                    </div>
                </div>
            </div>
        </div>
    );
}