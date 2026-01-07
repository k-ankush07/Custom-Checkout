import React, { useEffect, useState } from "react";
import currency from "locale-currency";
import ReviewProduct from "./sidebar/Review-product";
import ReviewText from "./sidebar/Review-text";
import ReviewVideo from "./sidebar/Review-video";
import UrgencyBar from "./sidebar/UrgencyBar";
import TrustBages from "./sidebar/Trust-bages";
import { getCurrency } from "locale-currency";

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

export default function Thankyou({
    shop, thankuu, setShowThankyouPage, showThankyouPage, products, refreshCart,
    videoInputs, getCurrencySymbol, currency, selectedProducts, productStyle,
    gridItemsPerRow, reviewInputs, selectedbar, setSelectedBar, setSelectedbages,
    selectedbages, setBagesStyle, setGridPerSlide, gridPerSlide, bagesStyle,
    selectedSections, sectionPositions, accessToken, storefrontToken, productHeading,
    activeTab, setActiveTab
}) {

    useEffect(() => {
        if (activeTab !== "thankyou") {
            setActiveTab("thankyou");
            localStorage.setItem("activeTab", "thankyou");
        }
    }, []);

    const [orderSummary, setOrderSummary] = useState(null);
    const [currencySymbol, setCurrencySymbol] = useState("₹");
    const [currencyCode, setCurrencyCode] = useState("");

    useEffect(() => {
        const navigationEntries = performance.getEntriesByType("navigation");
        const navigationType = navigationEntries.length > 0 ? navigationEntries[0].type : null;

        const summary = localStorage.getItem("orderSummary");
        if (summary) {
            try {
                const parsedSummary = JSON.parse(summary);
                setOrderSummary(parsedSummary);

                const countryCode = parsedSummary.customer?.country;
                if (countryCode) {
                    const code = getCurrency(countryCode) || "USD";
                    setCurrencyCode(code);
                    const symbol = getCurrencySymbol(code);
                    setCurrencySymbol(symbol);
                }

                if (navigationType === "reload" && !showThankyouPage) {
                    localStorage.removeItem("orderSummary");
                    setShowThankyouPage(false);
                }

                console.log(summary)
            } catch (e) {
                console.error("Failed to parse order summary", e);
            }
        }
    }, []);

    const sectionComponents = {
        review: (
            <ReviewText reviewInputs={reviewInputs} />
        ),
        product: (
            <ReviewProduct
                products={products}
                refreshCart={refreshCart}
                getCurrencySymbol={getCurrencySymbol}
                currency={currency}
                selectedProducts={selectedProducts}
                productStyle={productStyle}
                gridItemsPerRow={gridItemsPerRow}
                shop={shop}
                accessToken={accessToken}
                productHeading={productHeading}
                storefrontToken={storefrontToken}
            />
        ),
        video: (
            <ReviewVideo
                videoInputs={videoInputs}
            />
        ),
        urgencyBar: (
            <UrgencyBar
                selectedbar={selectedbar}
                setSelectedBar={setSelectedBar}
            />
        ),
        trustBages: (
            <TrustBages
                setSelectedbages={setSelectedbages}
                selectedbages={selectedbages}
                setBagesStyle={setBagesStyle}
                setGridPerSlide={setGridPerSlide}
                gridPerSlide={gridPerSlide}
                bagesStyle={bagesStyle}
            />
        ),
    };

    return (
        <div className="checkout-page message">
            <div className="checkout-pages-wrap">
                <img src={thankuu} alt="" />
                <h1>Thank You!</h1>
            </div>
            {["review", "product", "video", "urgencyBar", "trustBages"].map(
                (section) =>
                    selectedSections.includes(section) &&
                    sectionPositions[section] === "upperGraph" && (
                        <React.Fragment key={section}>
                            {sectionComponents[section]}
                        </React.Fragment>
                    )
            )}

            {orderSummary && (
                <div className="checkout-page">
                    <div className="checkout-page-thankyou-page">
                        <iframe
                            width="501"
                            height="350"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDV82xyOY0HX5aX3KJeTlAANzfdy25Z12Q&q=${encodeURIComponent(
                                orderSummary.customer?.address || "India"
                            )}`}
                        />

                        <div className="checkout-page-message-wraped">
                            <h3>Your order is confirmed</h3>
                            <p>You'll receive a confirmation email with your order number shortly.</p>
                        </div>
                    </div>

                    {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                        (section) =>
                            selectedSections.includes(section) &&
                            sectionPositions[section] === "lowerGraph" && (
                                <React.Fragment key={section}>
                                    {sectionComponents[section]}
                                </React.Fragment>
                            )
                    )}

                    <div className="checkout-page-wraped">
                        <h2>Contact information</h2>
                        <div className="checkout-page-order-details">
                            <div className="checkout-order">
                                <div className="checkout-page-message-wraped detalis">
                                    <h3>Order Details</h3>
                                    <p>{orderSummary.customer?.email}</p>
                                </div>
                                <div className="checkout-page-message-wraped detalis">
                                    <h3>Shipping address</h3>
                                    <p>{orderSummary.customer?.firstname} {orderSummary.customer?.lastname}</p>
                                    <p>{orderSummary.customer?.address}</p>
                                </div>
                                <div className="checkout-page-message-wraped detalis">
                                    <h3>Shipping method</h3>
                                    <p>{orderSummary.shipping?.method}</p>
                                </div>
                            </div>
                            <div className="checkout-order">
                                <div className="checkout-page-message-wraped detalis">
                                    <h3>Payment method</h3>
                                    <p>{currencySymbol}{orderSummary.amount_charged} {currencyCode}</p>
                                </div>
                                <div className="checkout-page-message-wraped detalis">
                                    <h3>Billing address</h3>
                                    <p>
                                        {orderSummary.billing
                                            ? `${orderSummary.billing.firstname || ""} ${orderSummary.billing.lastname || ""}, ${orderSummary.billing.address || ""}, ${orderSummary.billing.city || ""}, ${orderSummary.billing.state || ""}, ${orderSummary.billing.pin || ""}, ${orderSummary.billing.country || ""}`
                                            : `${orderSummary.customer.firstname || ""} ${orderSummary.customer.lastname || ""}, ${orderSummary.customer.address || ""}, ${orderSummary.customer.city || ""}, ${orderSummary.customer.state || ""}, ${orderSummary.customer.pin || ""}, ${orderSummary.customer.country || ""}`}
                                    </p>
                                </div>


                            </div>
                        </div>
                    </div>
                    {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                        (section) =>
                            selectedSections.includes(section) &&
                            sectionPositions[section] === "lastBilling" && (
                                <React.Fragment key={section}>
                                    {sectionComponents[section]}
                                </React.Fragment>
                            )
                    )}
                </div>
            )}
        </div>
    );
}
