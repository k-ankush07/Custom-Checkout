import React, { useState, useEffect } from "react";

export default function PaymentSetting({
    drop, paymentOptions, setCheckoutPaymentOtions, CheckoutPaymentOtions, cardoption,
    setStripePublishableKey, stripePublishableKey, stripeSecretKey, setStripeSecretKey,
    setRazorpayKey, razorpayKey, razorpayID, setRazorpayID
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const creditCardOption = paymentOptions.find(opt => opt.title === "Credit card");
    const isCreditCardSelected = creditCardOption
        ? CheckoutPaymentOtions.includes(creditCardOption.type)
        : false;

    const isRazorpaySelected = CheckoutPaymentOtions.some((type) =>
        paymentOptions
            .filter(opt => opt.title === "UPI" || opt.title === "Wallets")
            .map(opt => opt.type)
            .includes(type)
    );

    return (
        <div className="payment-setting-wrapper">
            <div
                className={`remove-btn-sidebar drop-btn settings ${isCollapsed ? "rotated" : ""}`}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <img src={drop} alt="Collapse" />
            </div>

            {!isCollapsed && (
                <div className="payment-options-section">
                    <div className="custom-checkbox-wrapper-options-setting">
                        {paymentOptions.map((option) => (
                            <div key={option.id}>
                                <div style={{ padding: '10px' }}>
                                    <label >
                                        <input
                                            type="checkbox"
                                            className="custom-checkbox"
                                            checked={CheckoutPaymentOtions.includes(option.type)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setCheckoutPaymentOtions([...CheckoutPaymentOtions, option.type]);
                                                } else {
                                                    setCheckoutPaymentOtions(
                                                        CheckoutPaymentOtions.filter((t) => t !== option.type)
                                                    );
                                                }
                                            }} />

                                        <p style={{ margin: 0 }}>{option.title}</p>
                                    </label>
                                </div>

                                {option.title === "Credit card" && CheckoutPaymentOtions.includes(option.type) && (
                                    <div className="setting-payment-options card">
                                        <div className="setting-payment-img"><img src={cardoption} alt="" /></div>
                                        <p>After clicking “Pay Now” you’ll be redirected to a secure UPI payment page. </p>
                                    </div>
                                )}

                                {option.title === "Cash on Delivery (COD)" && CheckoutPaymentOtions.includes(option.type) && (
                                    <div className="setting-payment-options card">
                                        <div className="setting-payment-img"><img src={cardoption} alt="" /></div>
                                        <p>After clicking “Pay Now” you’ll be redirected to a secure UPI payment page. </p>
                                    </div>
                                )}
                                {option.title === "Wallets" && CheckoutPaymentOtions.includes(option.type) && (
                                    <div className="setting-payment-options card">
                                        <div className="setting-payment-img"><img src={cardoption} alt="" /></div>
                                        <p>After clicking “Pay Now” you’ll be redirected to a secure UPI payment page. </p>
                                    </div>
                                )}
                                {option.title === "UPI" && CheckoutPaymentOtions.includes(option.type) && (
                                    <div className="setting-payment-options card">
                                        <div className="setting-payment-img"><img src={cardoption} alt="" /></div>
                                        <p>After clicking “Pay Now” you’ll be redirected to a secure UPI payment page. </p>
                                    </div>
                                )}

                            </div>
                        ))}
                        {isCreditCardSelected && (
                            <>
                                <div className="review-title checkout-side-bar review-items-wrap">
                                    <label>Stripe Key</label>
                                    <input
                                        type="text"
                                        value={stripePublishableKey}
                                        onChange={(e) => setStripePublishableKey(e.target.value)}
                                        placeholder="Enter Stripe Publishable Key"
                                    />
                                </div>
                                <div className="review-title checkout-side-bar review-items-wrap">
                                    <label>Stripe Secret Key</label>
                                    <input
                                        type="text"
                                        value={stripeSecretKey}
                                        onChange={(e) => setStripeSecretKey(e.target.value)}
                                        placeholder="Enter Stripe Secret Key"
                                    />
                                </div>
                            </>
                        )}
                        {isRazorpaySelected && (
                            <>
                                <div className="review-title checkout-side-bar review-items-wrap">
                                    <label>Razorpay ID</label>
                                    <input
                                        type="text"
                                        value={razorpayID}
                                        onChange={(e) => setRazorpayID(e.target.value)}
                                        placeholder="Enter Stripe Publishable Key"
                                    />
                                </div>
                                <div className="review-title checkout-side-bar review-items-wrap">
                                    <label>Razorpay Key</label>
                                    <input
                                        type="text"
                                        value={razorpayKey}
                                        onChange={(e) => setRazorpayKey(e.target.value)}
                                        placeholder="Enter Stripe Secret Key"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
