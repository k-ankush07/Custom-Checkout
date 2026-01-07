import { useState } from "react";
import displayblack from '../../../images/displayblack.webp';
import displaywhite from '../../../images/displaywhite.webp';
import deletebtn1 from '../../../images/delete.webp';
import drop1 from '../../../images/drop1.webp';
import drop from '../../../images/drop.webp';
import cardoption from "../../../images/cardoption.png";
import layoutblack from "../../../images/layoutblack.webp";
import layoutwhite from "../../../images/layoutwhite.webp";
import paymentblack from "../../../images/paymentblack.webp";
import paymentwhite from "../../../images/paymentwhite.webp";
import DisplaySetting from "./setting-options/Display-Setting";
import PaymentSetting from "./setting-options/Payment-Setting";
import ContactSetting from "./setting-options/Contact-Setting";

const settingOptions = [
    { label: 'Display', black: displayblack, white: displaywhite },
    { label: 'Layout', black: layoutblack, white: layoutwhite },
    { label: 'Payment and Discount', black: paymentblack, white: paymentwhite },
    { label: 'Customer Contact Method', black: displayblack, white: displaywhite }
];

export default function Setting({
    storefrontToken, setStorefrontToken, stripePublishableKey, setStripePublishableKey, stripeSecretKey,
    setStripeSecretKey, logo, setLogo, uploadFile, setHideLogo, hideLogo, setSideHideLogo, hideSideLogo,
    setSideLogo, sidelogo, bgColor, setBgColor, setBgImage, bgImage, selectedOption, setRazorpayID, razorpayID,
    razorpayKey, setRazorpayKey, setCheckOutBtnBgColor, checkOutBtnBgColor, paymentOptions, CheckoutPaymentOtions,
    setCheckoutPaymentOtions, setContactOptions, contactOptions
}) {
    const [uploading, setUploading] = useState(false);
    const [uploadingSide, setUploadingSide] = useState(false);
    const [uploadingbg, setUploadingbg] = useState(false);
    const [activeOption, setActiveOption] = useState(null);
    const filteredSettingOptions = settingOptions;

    const handleBgChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingbg(true);
            const uploadedUrl = await uploadFile(file);
            setBgImage(uploadedUrl);
        } catch (err) {
            console.error("❌ Logo upload failed:", err);
        } finally {
            setUploadingbg(false);
        }
    };

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const uploadedUrl = await uploadFile(file);
            setLogo(uploadedUrl);
            setHideLogo(false);
        } catch (err) {
            console.error("❌ Logo upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleSideChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingSide(true);
            const uploadedUrl = await uploadFile(file);
            setSideLogo(uploadedUrl);
            setSideHideLogo(false);
        } catch (err) {
            console.error("❌ Logo upload failed:", err);
        } finally {
            setUploadingSide(false);
        }
    };


    return (
        <div className="checkout-page-setting">
            {filteredSettingOptions.map((item) => (
                <div key={item.label}>
                    <div className={`setting-item ${activeOption === item.label ? "active" : ""}`}>
                        <div className={`setting-item-options-wrap ${activeOption === item.label ? "options-items" : ""}`}>
                            <div className="checkout-blocks setting-options" onClick={() => setActiveOption(item.label)}>
                                <div className={`checkout-add-img setting-options ${activeOption === item.label ? "checkout-add-img-active" : ""
                                    }`}>
                                    <img
                                        src={activeOption === item.label ? item.white : item.black}
                                        alt={item.label}
                                    />
                                </div>
                                <h3>{item.label}</h3>
                            </div>
                        </div>

                        {activeOption === item.label && (
                            <div className="checkout-setting-body">
                                {item.label === "Display" && <DisplaySetting
                                    setStorefrontToken={setStorefrontToken}
                                    storefrontToken={storefrontToken}
                                    deletebtn1={deletebtn1}
                                    drop1={drop1}
                                    handleLogoChange={handleLogoChange}
                                    setLogo={setLogo}
                                    hideLogo={hideLogo}
                                    logo={logo}
                                    setHideLogo={setHideLogo}
                                    selectedOption={selectedOption}
                                    handleSideChange={handleSideChange}
                                    hideSideLogo={hideSideLogo}
                                    setSideHideLogo={setSideHideLogo}
                                    sidelogo={sidelogo}
                                    setSideLogo={setSideLogo}
                                    bgColor={bgColor}
                                    setBgColor={setBgColor}
                                    handleBgChange={handleBgChange}
                                    bgImage={bgImage}
                                    setBgImage={setBgImage}
                                    checkOutBtnBgColor={checkOutBtnBgColor}
                                    setCheckOutBtnBgColor={setCheckOutBtnBgColor}
                                    drop={drop}
                                />}
                                {item.label === "Layout" && <div>Layout Settings Coming Soon...</div>}
                                {item.label === "Payment and Discount" && <PaymentSetting
                                    drop={drop}
                                    paymentOptions={paymentOptions}
                                    setCheckoutPaymentOtions={setCheckoutPaymentOtions}
                                    CheckoutPaymentOtions={CheckoutPaymentOtions}
                                    cardoption={cardoption}
                                    setStripePublishableKey={setStripePublishableKey}
                                    stripePublishableKey={stripePublishableKey}
                                    stripeSecretKey={stripeSecretKey}
                                    setStripeSecretKey={setStripeSecretKey}
                                    setRazorpayKey={setRazorpayKey}
                                    razorpayKey={razorpayKey}
                                    razorpayID={razorpayID}
                                    setRazorpayID={setRazorpayID}
                                />}
                                {item.label === "Customer Contact Method" && <ContactSetting
                                    contactOptions={contactOptions}
                                    setContactOptions={setContactOptions}
                                    drop={drop}
                                />}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

    );
}
