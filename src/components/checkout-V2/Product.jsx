import { useState } from "react";

export default function Product({ cartData, selectedShipping, discounts, crossbtn, selectedCountry, automaticDiscountMap, showSpinnerLineId,
    appliedCode, getCurrencySymbol, currency, discountObjects, code, handleApply, loading, message, success, subtotal, hasCodeDiscountInCart,
    updateQuantity, removeItem, setCode, handleRemove, discountDetails, shippingAmount, finalTotal, spinnerActionType, productDiscounts,
    pin, taxCountries, selectedProvince, totalEstimatedTax, discount, freeShippingCode, handleRemoveFreeShipping, currencySymbol,
    handleOrderClick, showProducts, downicon, minus, plus,remove,discount1,setShowProducts
}) {

    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = () => {
        setIsOpen(!isOpen);
        handleOrderClick?.();
    };

    const handleHide = ()=>{
      setIsOpen(!isOpen);
      handleOrderClick?.();
    }

    if (!cartData) return <p>No cart data found.</p>;

    if (!cartData || cartData?.lines?.edges?.length === 0) {
        return <p className="empty-cart-message">Your cart is empty.</p>;
    }

    return (
        <div className="custom-checkout-dashboard-wrap-products">
            <div className="custom-checkout-dashboard-header-checkout-v2">
                <div className="custom-checkout-dashboard-product"
                    onClick={handleToggle}
                    style={{ cursor: "pointer" }}>
                    <h5>Order Total</h5>
                    <div className="custom-checkout-prices">
                        <span>
                            {getCurrencySymbol(currency)}
                            {(finalTotal + totalEstimatedTax).toFixed(2)}
                        </span>
                        <div className="custom-checkout-downicon">
                            <img
                                src={downicon} alt="" className={isOpen ? "rotate" : ""}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showProducts && (<div className="checkout-page-products checkout-v2" onClick={handleHide} >
                 <div className="popup-box-checkout" onClick={(e) => e.stopPropagation()}>
                    <div className="checkout-page-products-add " style={{
                        opacity: showSpinnerLineId ? 0.5 : 1,
                        pointerEvents: showSpinnerLineId ? "none" : "auto",
                    }}>
                        {cartData?.lines?.edges?.map((item, index) => {
                            const line = item.node;
                            const variant = line.merchandise;
                            const product = variant.product;
                            const imageUrl = variant.image?.url || product.featuredImage?.url || '';
                            const altText = variant.image?.altText || product.featuredImage?.altText || product.title;
                            const price = parseFloat(variant.price.amount);
                            const quantity = line.quantity;
                            const productId = product?.id
                                ? product.id.replace("gid://shopify/Product/", "")
                                : null;
                            const attributes = line.attributes || [];

                            return (
                                <div key={index} className="product-card checkout-v2">
                                    <div className="product-image">
                                        <img src={imageUrl} alt={altText} />
                                    </div>
                                    <div className="product-info">
                                        <div className="product-info-left">
                                            <h4 className="product-title">{product.title}</h4>
                                            <p className="product-variant">{variant.title}</p>

                                            {attributes && attributes.length > 0 && (
                                                <div className="product-variant attributes">
                                                    {attributes.map((attr, index) => (
                                                        <div className="product-attributes" key={index}>
                                                            <p>{attr.key}:{attr.value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {(productDiscounts[productId]) && (
                                                <div className="product-discount">
                                                    <div className="product-discount-img"><img src={discount1} alt="" /></div>
                                                    {productDiscounts[productId] && (
                                                        <div className="product-discount-text">
                                                            {productDiscounts[productId].title?.toUpperCase()} (
                                                            -{getCurrencySymbol(currency)}{productDiscounts[productId].amount.toFixed(2)})
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="quantity-wrapper checkout-v2">
                                                <div onClick={() => updateQuantity(line.id, line.quantity - 1)} className="btn-fetcher minus" disabled={line.quantity <= 1}><img src={minus} /></div>
                                                <div className="checkout-line-quantity">{quantity}</div>
                                                <div onClick={() => updateQuantity(line.id, line.quantity + 1)} className="btn-fetcher plus"><img src={plus} /></div>
                                            </div>
                                        </div>

                                        <div className="price-remove-wrapper checkout-v2">
                                            <button onClick={() => removeItem(line.id)} className="remove-btn product">
                                                <img src={remove} alt="Remove" />
                                            </button>
                                            <div className="price-block">
                                                {(() => {
                                                    const codeDiscount = discountObjects.find(discount =>
                                                        discount.__typename === "DiscountCodeBasic" &&
                                                        discount.codes?.edges?.some(edge =>
                                                            edge.node.code.toLowerCase() === appliedCode?.toLowerCase()
                                                        ) &&
                                                        discount.customerGets?.items?.products?.edges?.some(edge =>
                                                            edge.node.id.replace("gid://shopify/Product/", "") === productId
                                                        )
                                                    );

                                                    const autoDiscount = automaticDiscountMap.get(productId);
                                                    const symbol = getCurrencySymbol(currency) || ` ${currency}`;
                                                    const quantity = line?.quantity || 1;
                                                    const totalPrice = price * quantity;

                                                    const formatPrice = (amount) => {
                                                        return amount <= 0 ? "Free" : `${symbol}${amount.toFixed(2)}`;
                                                    };

                                                    if (codeDiscount) {
                                                        const value = codeDiscount.customerGets?.value;
                                                        let discountAmount = 0;

                                                        if (value?.percentage) {

                                                            discountAmount = price * quantity * value.percentage;
                                                        } else if (value?.amount?.amount || value?.fixedAmount?.amount) {

                                                            discountAmount = parseFloat(value.amount?.amount || value.fixedAmount?.amount);
                                                        }

                                                        const finalPrice = totalPrice - discountAmount;

                                                        return (
                                                            <>
                                                                <span className="original-price">{formatPrice(totalPrice)}</span>
                                                                <span className="discounted-price">{formatPrice(finalPrice)}</span>
                                                            </>
                                                        );
                                                    }

                                                    if (!appliedCode && autoDiscount) {
                                                        const finalPrice = totalPrice - autoDiscount.discountAmount;

                                                        return (
                                                            <>
                                                                <span className="original-price">{formatPrice(totalPrice)}</span>
                                                                <span className="discounted-price">{formatPrice(finalPrice)}</span>
                                                            </>
                                                        );
                                                    }

                                                    return <span className="discounted-price">{formatPrice(totalPrice)}</span>;
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                    {showSpinnerLineId === line.id && spinnerActionType === "update" && (
                                        <div style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            zIndex: 10,
                                        }}>
                                            <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: 30, color: "grey" }} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className='checkout-page-pay-option'>
                        <span>Subtotal</span>
                        <span className="checkout-page-right">{getCurrencySymbol(currency)}{subtotal.toFixed(2)}</span>
                    </div>
                    {discountDetails.code && (
                        <div className="checkout-page-pay-option">
                            <div className="discount-info">
                                <span className="discount-label">Order discount</span>
                                <span className="discount-code">
                                      <img src={discount1} alt="" />
                                    <span>{discountDetails.code}</span>
                                </span>
                            </div>
                            <span className="discount-amount checkout-page-right">
                                -{getCurrencySymbol(currency)}{discountDetails.amount.toFixed(2)}
                            </span>
                        </div>
                    )}

                    <div className='checkout-page-pay-option'>
                        <span>Shipping</span>
                        <span className="checkout-page-right">
                            {!pin ? (
                                "Enter shipping address"
                            ) : shippingAmount === null ? (
                                <span className="skeleton-loader skeleton-amount"></span>
                            ) : shippingAmount === 0 ? (
                                "Free"
                            ) : (
                                `${getCurrencySymbol(currency)}${shippingAmount.toFixed(2)}`
                            )}
                        </span>
                    </div>

                    {totalEstimatedTax > 0 && (
                        <div className='checkout-page-pay-option'>
                            <span>Estimated taxes</span>
                            <span className="checkout-page-right"> {getCurrencySymbol(currency)}{totalEstimatedTax.toFixed(2)}</span>
                        </div>
                    )}

                    <div className='checkout-page-pay-option total'>
                        <span>Total</span>
                        <span className="checkout-page-right">
                            <p>{currency}</p>
                            {getCurrencySymbol(currency)}
                            {(finalTotal + totalEstimatedTax).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
            )}
        </div>

    );
}
