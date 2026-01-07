import React, { useRef, useState } from "react";
import PaymentCardV2 from "./Payment-card";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const PaymentPage = ({ cartData, deliveryData, pin, selectedCountry, discountDetails, shippingAmount, finalTotal, input, selectedShipping,
    selectedProvince, productDiscounts, validateFields, validateInput, taxCountries, currency, selectedPayment,
    setShowThankyouPage, billingAddress, totalEstimatedTax, stripePublishableKey, stripeSecretKey, shop,accessToken,storefrontToken
}) => {
    
    const paymentRef = useRef();
    const [loading, setLoading] = useState(false);

    const handlePayNow = async () => {
        setLoading(true);
        const isFieldsValid = validateFields();
        const isCardValid = true;

        if ( !isFieldsValid || (selectedPayment?.type === "card" && !isCardValid)) {
            alert("Please fill all required fields correctly.");
            setLoading(false);
            return;
        }

        const cartItems = cartData?.lines?.edges || [];
        if (cartItems.length === 0) {
            alert("Please select at least one product before proceeding.");
            setLoading(false);
            return;
        }

        const amount = parseFloat(finalTotal || 0).toFixed(2);
        const taxAmount = parseFloat(totalEstimatedTax || 0).toFixed(2);

        const billing = {
            firstname: billingAddress?.firstName || deliveryData?.firstName || "",
            lastname: billingAddress?.lastName || deliveryData?.lastName || "",
            address: billingAddress?.address || deliveryData?.address || "",
            apartment: billingAddress?.apartment || deliveryData?.apartment || "",
            city: billingAddress?.city || deliveryData?.city || "",
            state: billingAddress?.state || selectedProvince || "",
            pin: billingAddress?.postalCode || pin || "",
            country: billingAddress?.country || selectedCountry || "IN",
            phone: billingAddress?.phone || deliveryData?.phone || ""
        };

        const tax = {
            name: taxCountries?.name || "IGST",
            rate: taxCountries?.rate || 0.18,
            amount: taxAmount
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
                phone: deliveryData?.phone || ""
            },
            billing,
            shipping: {
                method: selectedShipping?.title || "Standard Shipping",
                amount: parseFloat(shippingAmount || 0).toFixed(2)
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
                            type: discount.type
                        }
                        : null,
                    image: variant?.image?.url || product?.featuredImage?.url || "",
                    variant_id: variant?.id?.replace("gid://shopify/ProductVariant/", "") || null
                };
            }) || [],
            discount: discountDetails?.code
                ? {
                    code: discountDetails.code,
                    amount: parseFloat(discountDetails.amount).toFixed(2)
                }
                : null,
            tax,
            total: amount,
            amount_charged: (parseFloat(amount) + parseFloat(taxAmount)).toFixed(2),
            payment: {}
        };

        try {

            if (selectedPayment?.type === "card") {
                const { stripe, elements, submitPayment } = paymentRef.current;

                const { error, paymentMethod } = await submitPayment();
                if (error) throw new Error(error.message);

                const res = await fetch(`${apiBaseUrl}/create-payment-intent`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: parseFloat(amount) + parseFloat(taxAmount),
                        currency,
                        email: input,
                        stripeSecretKey,
                        customer: {
                            firstname: deliveryData?.firstName || "",
                            lastname: deliveryData?.lastName || "",
                            address1: deliveryData?.address || "",
                            city: deliveryData?.city || "",
                            state: selectedProvince || "",
                            pin,
                            country: selectedCountry || "IN"
                        },
                        shop, accessToken
                    })
                });

                const { clientSecret } = await res.json();

                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethod.id
                });

                if (result.error) throw new Error(result.error.message);

                if (result.paymentIntent.status === "succeeded") {
                    const chargeDetails =
                        result?.paymentIntent?.charges?.data?.[0]?.payment_method_details?.card || {};

                    orderSummary.payment.type = "card";
                    orderSummary.payment.card = {
                        brand: chargeDetails.brand,
                        last4: chargeDetails.last4,
                        exp_month: chargeDetails.exp_month,
                        exp_year: chargeDetails.exp_year
                    };

                    const orderRes = await fetch(`${apiBaseUrl}/api/complete-order`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ order: orderSummary, cart_id: cartData?.id, shop, accessToken, storefrontToken })
                    });

                    const data = await orderRes.json();
                    if (!orderRes.ok) throw new Error(data?.error || "Card order failed");

                    alert("✅ Payment successful and order placed!");
                    setShowThankyouPage(true);
                    localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
                }
            }
        } catch (err) {
            console.error("❌ Error during checkout:", err);
            alert("❌ Something went wrong: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-payment-create-card">
           <PaymentCardV2 ref={paymentRef} stripePublishableKey={stripePublishableKey} />
            <button
                onClick={handlePayNow}
                disabled={loading}
                className="btn card"
            >
                {loading ? "Processing..." : 'Continue Payment'}
            </button>
        </div>
    );
};
export default PaymentPage;
