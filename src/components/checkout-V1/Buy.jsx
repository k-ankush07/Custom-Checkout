import PaymentWrapper from "./Payment";
import React, { useRef, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from "./Payment";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function Buy({ cartData, deliveryData, pin, selectedCountry, discountDetails, shippingAmount, finalTotal, input,
    selectedShipping, selectedProvince, productDiscounts, validateFields, validateInput, taxCountries, currency,
    paymentOptions, setSelectedPayment, selectedPayment, card1, card2, card3, card4, shopImage, klarna1, Afterpay1,
    useShippingAsBilling, setUseShippingAsBilling, AllowedCountries, billing, box, selectedbilling, showTip,
    handleCheckboxChange, showRember, handleRember, setSelectedBilling, card6, card10, card5, card7, setShowThankyouPage, showThankyouPage, handleChangeBilling,
    billingAddress, cardErrors, isStripeInputValid, complete, setComplete, setCardErrors, totalEstimatedTax, stripePublishableKey, shop, stripeSecretKey,
    setUpiId, upiId, accessToken, razorpayID, razorpayKey,storefrontToken, checkOutBtnBgColor,CheckoutPaymentOtions
}) {
   
    const [loading, setLoading] = useState(false);
    const getCurrencySymbol = (currencyCode) => {
        try {
            const symbol = new Intl.NumberFormat("en", {
                style: "currency",
                currency: currencyCode,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })
                .formatToParts(0)
                .find((part) => part.type === "currency")?.value;

            return symbol || currencyCode;
        } catch {
            return currencyCode;
        }
    };

    const currencyCode =
        cartData?.lines?.edges?.[0]?.node?.merchandise?.price?.currencyCode || "USD";

    const paymentFormRef = useRef();
    const stripePromise = loadStripe(stripePublishableKey);
    const secretKey = stripeSecretKey;

    const handleClick = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            handlePayNow();
        }, 3000);
    };

    const handlePayNow = async () => {
        setLoading(true);

        const isInputValid = validateInput(input);
        const isFieldsValid = validateFields();
        const isCardValid = selectedPayment?.type === "card" ? isStripeInputValid() : true;

        if (!isInputValid || !isFieldsValid || !isCardValid) {
          
            const container = document.querySelector(".custom-checkout");
            if (container) {
                container.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
            setLoading(false);
            return;
        }

        const cartItems = cartData?.lines?.edges || [];
        if (cartItems.length === 0) {
            alert("Please select at least one product before proceeding.");
            setLoading(false);
            return;
        }

        const url = new URL(window.location.href);
        const cartToken = url.searchParams.get("cart_token");
        const cartId =
            cartToken && cartToken.trim() !== ""
                ? cartToken.startsWith("gid://shopify/Cart/")
                    ? cartToken
                    : `gid://shopify/Cart/${cartToken}`
                : localStorage.getItem("cart_token");

        const amount = parseFloat(finalTotal).toFixed(2);
        const taxAmount = totalEstimatedTax.toFixed(2);

        const billing = {
            firstname: useShippingAsBilling ? deliveryData?.firstName || "" : billingAddress?.firstName || deliveryData?.firstName || "",
            lastname: useShippingAsBilling ? deliveryData?.lastName || "" : billingAddress?.lastName || deliveryData?.lastName || "",
            address: useShippingAsBilling ? deliveryData?.address || "" : billingAddress?.address || deliveryData?.address || "",
            apartment: useShippingAsBilling ? deliveryData?.apartment || "" : billingAddress?.apartment || deliveryData?.apartment || "",
            city: useShippingAsBilling ? deliveryData?.city || "" : billingAddress?.city || deliveryData?.city || "",
            state: useShippingAsBilling ? selectedProvince || "" : billingAddress?.state || selectedProvince || "",
            pin: useShippingAsBilling ? pin : billingAddress?.postalCode || pin || "",
            country: useShippingAsBilling ? selectedCountry || "IN" : billingAddress?.country || selectedCountry || "IN",
            phone: useShippingAsBilling ? deliveryData?.phone || "" : billingAddress?.phone || deliveryData?.phone || "",
        };

        const tax = {
            name: taxCountries?.name || "IGST",
            rate: taxCountries?.rate || 0.18,
            amount: taxAmount,
        };

        const orderSummary = {
            currency,
            customer: {
                firstname: deliveryData?.firstName || "",
                lastname: deliveryData?.lastName || "",
                email: input,
                pin,
                country: selectedCountry,
                state: selectedProvince || "",
                city: deliveryData?.city || "",
                address: deliveryData?.address || "",
                apartment: deliveryData?.apartment || "",
                phone: deliveryData?.phone || "",
            },
            billing,
            shipping: {
                method: selectedShipping?.title || "Standard Shipping",
                amount: parseFloat(shippingAmount || 0).toFixed(2),
            },
            items: cartData?.lines?.edges?.map(({ node }) => {
                const product = node?.merchandise?.product;
                const variant = node?.merchandise;
                const originalPrice = parseFloat(variant?.price?.amount) || 0;
                const productId = product?.id?.replace("gid://shopify/Product/", "");
                const discount = productDiscounts?.[productId];

                return {
                    title: product?.title,
                    variant: variant?.title,
                    quantity: node?.quantity,
                    price: originalPrice.toFixed(2),
                    discount: discount
                        ? {
                            title: discount.title,
                            amount: parseFloat(discount.amount).toFixed(2),
                            type: discount.type,
                        }
                        : null,
                    image: variant?.image?.url || product?.featuredImage?.url || "",
                    variant_id: variant?.id?.replace("gid://shopify/ProductVariant/", "") || null,
                };
            }) || [],
            discount: discountDetails?.code
                ? {
                    code: discountDetails.code,
                    amount: parseFloat(discountDetails.amount).toFixed(2),
                }
                : null,
            tax,
            total: amount,
            amount_charged: (parseFloat(amount) + parseFloat(taxAmount)).toFixed(2),
            payment: {},
        };

        try {

            if (selectedPayment?.type === "cash") {
                orderSummary.payment.type = "cash";
                orderSummary.payment.card = null;

                const res = await fetch(`${apiBaseUrl}/api/complete-order`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order: orderSummary, cart_id: cartId, shop, accessToken, storefrontToken }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Cash order failed");

                alert("✅ Order placed successfully (Cash on Delivery)");
                setShowThankyouPage(true);

                localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
                ["deliveryData", "pin", "selectedProvince", "contactInfo", "appliedDiscountCode", "appliedFreeShippingCode"].forEach(item => localStorage.removeItem(item));
                setLoading(false);
                return;
            }

            if (selectedPayment?.type === "card") {
                if (!isCardValid) {
                    setLoading(false);
                    return;
                }
                const stripe = await stripePromise;
                const stripesecretKey = await secretKey;

                const paymentIntentRes = await fetch(`${apiBaseUrl}/create-payment-intent`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: parseFloat(amount) + parseFloat(taxAmount),
                        currency,
                        email: input,
                        stripeSecretKey: stripesecretKey,
                        customer: {
                            firstname: deliveryData?.firstName || "",
                            lastname: deliveryData?.lastName || "",
                            address1: deliveryData?.address || "",
                            city: deliveryData?.city || "",
                            state: selectedProvince || "",
                            pin,
                            country: selectedCountry || "IN",
                        },
                        shop, accessToken
                    }),
                });

                const { clientSecret } = await paymentIntentRes.json();
                const { error, paymentMethod } = await paymentFormRef.current.submitPayment();
                if (error) throw new Error(error.message);

                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethod.id,
                });

                if (result.error) throw new Error(result.error.message);

                if (result.paymentIntent.status === "succeeded") {
                    const charges = result?.paymentIntent?.charges?.data;
                    const chargeDetails = Array.isArray(charges) && charges.length > 0 ? charges[0]?.payment_method_details?.card : {};

                    orderSummary.payment.type = "card";
                    orderSummary.payment.card = {
                        brand: chargeDetails.brand,
                        last4: chargeDetails.last4,
                        exp_month: chargeDetails.exp_month,
                        exp_year: chargeDetails.exp_year,
                    };

                    const res = await fetch(`${apiBaseUrl}/api/complete-order`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ order: orderSummary, cart_id: cartId, shop, accessToken, storefrontToken }),
                    });

                    const data = await res.json();
                    if (!res.ok) throw new Error(data?.error || "Card order failed");

                    alert("✅ Payment successful and order placed!");
                    setShowThankyouPage(true);
                    localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
                    ["deliveryData", "pin", "selectedProvince", "contactInfo", "appliedDiscountCode", "appliedFreeShippingCode"].forEach(item => localStorage.removeItem(item));
                }
            }

            if (selectedPayment?.type === "upi" || selectedPayment?.type === "wallet") {
                const orderRes = await fetch(`${apiBaseUrl}/create-order`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: parseFloat(amount) + parseFloat(taxAmount),
                        currency,
                        razorpayID,
                        razorpayKey
                    }),
                });

                const orderData = await orderRes.json();
                const isUPI = selectedPayment?.type === "upi";
                const isWallet = selectedPayment?.type === "wallet";

                const options = {
                    key: razorpayID,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "Shopify Order",
                    description: `Payment via ${selectedPayment.type}`,
                    order_id: orderData.id,
                    handler: function (response) {
                        alert("✅ Payment successful! Completing your order...");
                        setShowThankyouPage(true);

                        (async () => {
                            try {
                                orderSummary.payment.type = selectedPayment.type;
                                orderSummary.payment.razorpay_payment_id = response.razorpay_payment_id;

                                const res = await fetch(`${apiBaseUrl}/api/complete-order`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ order: orderSummary, cart_id: cartId, shop, accessToken }),
                                });

                                const data = await res.json();
                                if (!res.ok) throw new Error(data?.error || "Order failed");

                                localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
                                ["deliveryData", "pin", "selectedProvince", "contactInfo", "appliedDiscountCode", "appliedFreeShippingCode"].forEach(item => localStorage.removeItem(item));
                            } catch (err) {
                                console.error("Order completion failed:", err);
                            }
                        })();
                    },
                    theme: { color: "#3399cc" },
                    method: {
                        upi: isUPI,
                        wallet: isWallet,
                        card: false,
                        netbanking: false,
                        paylater: false,
                    },
                    prefill: isUPI ? { method: "upi" } : isWallet ? { method: "wallet" } : {},
                    modal: { ondismiss: function () { alert("Payment cancelled"); } },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                setLoading(false);
                return;
            }
        } catch (err) {
            console.error("❌ Error during checkout:", err);
            alert("❌ Something went wrong: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PaymentForm
                ref={paymentFormRef}
                paymentOptions={paymentOptions}
                setSelectedPayment={setSelectedPayment}
                selectedPayment={selectedPayment}
                card1={card1}
                card2={card2}
                card3={card3}
                card4={card4}
                card6={card6}
                card10={card10}
                card5={card5}
                card7={card7}
                shopImage={shopImage}
                klarna1={klarna1}
                Afterpay1={Afterpay1}
                useShippingAsBilling={useShippingAsBilling}
                setUseShippingAsBilling={setUseShippingAsBilling}
                selectedCountry={selectedCountry}
                AllowedCountries={AllowedCountries}
                billing={billing}
                box={box}
                selectedbilling={selectedbilling}
                showTip={showTip}
                handleCheckboxChange={handleCheckboxChange}
                showRember={showRember}
                handleRember={handleRember}
                setSelectedBilling={setSelectedBilling}
                billingAddress={billingAddress}
                handleChangeBilling={handleChangeBilling}
                cardErrors={cardErrors}
                complete={complete}
                setComplete={setComplete}
                setCardErrors={setCardErrors}
                isStripeInputValid={isStripeInputValid}
                stripePublishableKey={stripePublishableKey}
                stripeSecretKey={stripeSecretKey}
                setUpiId={setUpiId}
                upiId={upiId}
                CheckoutPaymentOtions={CheckoutPaymentOtions}
            />
            {/* <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
                <h2>Cart Summary</h2>
                {cartData?.lines?.edges?.map(({ node }, index) => {
                    const product = node?.merchandise?.product;
                    const variant = node?.merchandise;
                    const imageUrl =
                        variant?.image?.url || product?.featuredImage?.url || "";
                    const productId = product?.id?.replace("gid://shopify/Product/", "");

                    const discount = productDiscounts?.[productId];

                    return (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #ddd",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "8px",
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt={product?.title}
                                style={{ width: "100px", height: "auto" }}
                            />
                            <p>
                                <strong>Product:</strong> {product?.title || "N/A"}
                            </p>
                            <p>
                                <strong>Variant:</strong>{" "}
                                {variant?.title !== "Default Title"
                                    ? variant?.title
                                    : ""}
                            </p>
                            <p>
                                {discount && (
                                    <p style={{ color: "green" }}>
                                        <strong>Discount:</strong> {discount.title} -{" "}
                                        {getCurrencySymbol(currencyCode)}
                                        {parseFloat(discount.amount).toFixed(2)}
                                    </p>
                                )}
                                <strong>Price:</strong> {getCurrencySymbol(currencyCode)}
                                {variant?.price?.amount}
                            </p>
                            <p>
                                <strong>Quantity:</strong> {node?.quantity}
                            </p>

                        </div>
                    );
                })}

                <h3>Delivery Details</h3>
                <p>
                    <strong>Name:</strong>{" "}
                    {deliveryData?.firstName && deliveryData?.lastName
                        ? `${deliveryData.firstName} ${deliveryData.lastName}`
                        : deliveryData?.fullName || "N/A"}
                </p>
                <p>
                    <strong>Email:</strong> {input}
                </p>
                <p>
                    <strong>Address:</strong> {deliveryData?.address}
                </p>
                {deliveryData?.apartment && (
                    <p>
                        <strong>Apartment:</strong> {deliveryData.apartment}
                    </p>
                )}
                <p>
                    <strong>City:</strong> {deliveryData?.city}
                </p>
                <p>
                    <strong>State/Province:</strong> {selectedProvince || "N/A"}
                </p>
                <p>
                    <strong>Pin Code:</strong> {pin || "N/A"}
                </p>
                <p>
                    <strong>Country:</strong> {selectedCountry || "N/A"}
                </p>

                <h3>Shipping & Discounts</h3>
                <p>
                    <strong>Shipping Amount:</strong>{" "}
                    {getCurrencySymbol(currencyCode)} {shippingAmount || 0}
                    <br />
                    <strong>Shipping Method:</strong>{" "}
                    {selectedShipping?.title || "Not selected"}
                </p>

                <p>
                    <strong>Discount:</strong>{" "}
                    {discountDetails?.amount
                        ? `${discountDetails.code} - ${getCurrencySymbol(currencyCode)}${discountDetails.amount}`
                        : "No discounts applied"}
                </p>
                <div className='checkout-page-pay-option'>
                    <span>Estimated taxes</span>
                    <span>{getCurrencySymbol(currency)}{totalEstimatedTax.toFixed(2)}</span>
                </div>

                <h3>Final Total</h3>
                <p>
                    <strong>Total:</strong> {getCurrencySymbol(currencyCode)}
                    {(parseFloat(finalTotal) + totalEstimatedTax).toFixed(2)}
                </p>
            </div> */}
             <div className="checkout-pay-button-section">
                <button id="checkout-pay-button" className="btn" style={{background:checkOutBtnBgColor}} onClick={handleClick} disabled={loading}>
                    {loading ? (
                        <i
                            className="fa fa-circle-o-notch fa-spin"
                            style={{ fontSize: 18, color: "white" }}
                        />
                    ) : selectedPayment?.type === "cash" ? (
                        "Complete Order"
                    ) : (
                        "Pay Now"
                    )}
                </button>
             </div>
        </>
    );
}
