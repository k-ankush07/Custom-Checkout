import { useState, useEffect } from "react";
import cardpayment from '../../images/cardpayment.webp';
import walletpayment from '../../images/walletpayment.webp';
import codpayment from '../../images/codpayment.webp';
import upipayment from '../../images/upipayment.webp';
import cross from '../../images/cross.png';

export default function PaymentOption({ paymentOptions, setSelectedPayment, selectedPayment, setShowPaymentCard,
    getCurrencySymbol, finalTotal, currency, totalEstimatedTax, handlePayNow, showPaymentCard,
    activePaymentType, setActivePaymentType, setShowCodPopup, showCodPopup, CheckoutPaymentOtions,
}) {
    const [codCode, setCodCode] = useState("");
    const [inputCode, setInputCode] = useState("");

    const paymentImages = {
        "Credit card": cardpayment,
        "Wallets": walletpayment,
        "Cash on Delivery (COD)": codpayment,
        "UPI": upipayment,
    };

    function generateCodCode() {
        const randomLetter = () => String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
        const randomNumber = (digits = 2) => Math.floor(Math.random() * Math.pow(10, digits)).toString().padStart(digits, '0');
        const randomAlphaNum = () => {
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            return chars[Math.floor(Math.random() * chars.length)];
        };
        return randomLetter() + randomLetter() + randomNumber(2) + randomAlphaNum() + randomAlphaNum();
    }

    useEffect(() => {
        if (!selectedPayment) return;

        setActivePaymentType(selectedPayment.title);

        if (selectedPayment.title === "Cash on Delivery (COD)") {
            setCodCode(generateCodCode());
            setInputCode("");
            setShowPaymentCard(false);
            setShowCodPopup(true);
        } else {
            setShowCodPopup(false);
        }

        if (selectedPayment.title === "Credit card") {
            setShowPaymentCard(true);
        }

        if (selectedPayment.title === "UPI" || selectedPayment.title === "Wallets") {
            setShowPaymentCard(false);
            handlePayNow();
        }
    }, [selectedPayment]);

    const totalAmount = (parseFloat(finalTotal || 0) + parseFloat(totalEstimatedTax || 0)).toFixed(2);

    const handleCancel = () => {
        setShowCodPopup(false);
        setSelectedPayment(null);
    }

    const sortedOptions = paymentOptions
        .filter(option => CheckoutPaymentOtions.includes(option.type))
        .sort((a, b) => CheckoutPaymentOtions.indexOf(a.type) - CheckoutPaymentOtions.indexOf(b.type));

    return (
        <div className="checkout-contact checkout-h2 payment checkout-v2">
            <div className="checkout-payment shipping-methods">
                {sortedOptions
                    .map((option, index) => (
                        <div
                            key={option.id}
                            className={`checkout-payment-list ${selectedPayment?.id === option.id ? "selected" : ""}`}
                            onClick={() => setSelectedPayment(option)}
                        >
                            <label
                                className={`shipping-option ${selectedPayment?.id === option.id ? "selected" : ""} ${index === paymentOptions.length - 1 ? "no-bottom" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    style={{ display: 'none' }}
                                    checked={selectedPayment?.id === option.id}
                                    onChange={() => setSelectedPayment(option)}
                                />
                                <div className="option-box">
                                    <div className="checkout-add-img">
                                        <img
                                            src={paymentImages[option.title]}
                                            alt={option.title}
                                        />
                                    </div>
                                    <span className="option-title img-item">
                                        {option.title === "Credit card" || option.title === "Cash on Delivery (COD)" || option.title === "Wallets" || option.title === "UPI" ? (
                                            <div className="shop-card">
                                                <div className="shop-left">
                                                    <span>{option.title}</span>
                                                    <span>{getCurrencySymbol(currency)}{totalAmount}</span>
                                                </div>
                                            </div>
                                        ) : option.title}
                                    </span>
                                </div>
                            </label>

                            {option.title === "Credit card" && selectedPayment?.id === option.id && showPaymentCard && (
                                <div className="credit-card-fields credit-card show"></div>
                            )}
                            {option.title === "Wallets" && selectedPayment?.id === option.id && activePaymentType === "Wallets" && (
                                <div className="wallet-fields"></div>
                            )}
                            {option.title === "UPI" && selectedPayment?.id === option.id && activePaymentType === "UPI" && (
                                <div className="upi-fields"></div>
                            )}
                        </div>
                    ))}
            </div>

            {activePaymentType === "Cash on Delivery (COD)" && showCodPopup && (
                <div className="popup-overlay hide-checkout cod">
                    <div className="popup-box cod-content">
                        <div className="popup-actions-cross" onClick={handleCancel}><img src={cross} alt="" /></div>
                        <h3>Confirm Your order {getCurrencySymbol(currency)}{totalAmount}</h3>
                        <p>Please enter the code to confirm your order:</p>
                        <div className="code-code-payment">
                            {codCode}
                        </div>
                        <div className="code-code-enter">
                            <label htmlFor="">Enter the code shown above to place your order.</label>
                            <input
                                type="text"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                placeholder="Enter the code shown above" />
                        </div>
                        <button
                            disabled={inputCode !== codCode}
                            onClick={async () => {
                                await handlePayNow();
                                setActivePaymentType(null);
                                setShowCodPopup(false);
                            }}
                        >
                            Confirm COD order
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .razorpay-container {
                  position: fixed !important;
                  top: 50% !important;
                  left: 50% !important;
                  transform: translate(-50%, -50%) !important;
                  width: 460px !important;
                  height: 90% !important;
                }
                .razorpay-checkout-frame {
                  border-radius: 10px !important;
                }
                .razorpay-backdrop {
                  display: none !important;
                }
            `}</style>
        </div>
    );
}
