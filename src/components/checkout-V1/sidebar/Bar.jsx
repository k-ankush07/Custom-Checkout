import { useState } from "react";

export default function Bar({ activeTab, setActiveTab, setActiveSetting, setSaveData }) {

    const [activeSave, setActiveSave] = useState("");

    const handleSaved = () => {
        setSaveData(true);
    }

    const handleCancle = () => {
        setSaveData(false);
    }

    return (
        <div className="checkout-page-bar" >
            <div className="checkout-contact checkout-h3 sidebar checkout">
                <div
                    className={`checkout-title-h3 checkout ${activeTab === "checkout" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("checkout");
                        setActiveSetting('');
                    }}
                >
                    <h3>Checkout</h3>
                </div>
                <div
                    className={`checkout-title-h3 checkout ${activeTab === "thankyou" ? "active" : ""}`}
                    onClick={() => setActiveTab("thankyou")}
                >
                    <h3>Thank you</h3>
                </div>
            </div>
          
            <div className="checkout-contact checkout-h3 sidebar save-btn">
                <div
                    className={`checkout-title-h3-setting checkout ${activeSave === "cancle" ? "active" : ""}`}
                    onClick={() => setActiveSave("cancle")}
                >
                    <p onClick={handleCancle}>Cancle</p>
                </div>
                <div
                    className={`checkout-title-h3-setting publish ${activeSave === "save" ? "active" : ""}`}
                    onClick={() => setActiveSave("save")}
                >
                    <p onClick={handleSaved}>Save & Publish</p>
                </div>
            </div>
        </div>
    )
}
