export default function Product({ cartData, selectedShipping, discounts, crossbtn, selectedCountry, automaticDiscountMap, showSpinnerLineId,
    appliedCode, getCurrencySymbol, currency, discountObjects, code, handleApply, loading, message, success, subtotal, hasCodeDiscountInCart,
    updateQuantity, removeItem, setCode, handleRemove, discountDetails, shippingAmount, finalTotal, spinnerActionType, productDiscounts,
    pin, taxCountries, selectedProvince, totalEstimatedTax, discount, freeShippingCode, handleRemoveFreeShipping, plus,
    currencySymbol, discount1, deletebtn, minus, discross, checkOutBtnBgColor
}) {
    if (!cartData) return <p>No cart data found.</p>;

    if (!cartData || cartData?.lines?.edges?.length === 0) {
        return <p className="empty-cart-message">Your cart is empty.</p>;
    }

    return (
        <div className='checkout-page-customer-page checkout-h2' style={
            showSpinnerLineId === "country-update" && spinnerActionType === "update"
                ? { pointerEvents: "none", opacity: 0.5 }
                : {}
        } >

            {showSpinnerLineId === "country-update" && spinnerActionType === "update" && (
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
            <div className="checkout-page-products">
                <div className="checkout-page-products-add" style={{
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
                            <div key={index} className="product-card">
                                <div className="product-image">
                                    <img src={imageUrl} alt={altText} />
                                    <div className="checkout-product-length">{quantity}</div>
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

                                        {productDiscounts[productId] && (
                                            <div className="product-discount">
                                                <div className="product-discount-img">
                                                    <img src={discount1} alt="" />
                                                </div>
                                                <div className="product-discount-text">
                                                    {productDiscounts[productId].title?.toUpperCase()} (
                                                    -{getCurrencySymbol(currency)}{productDiscounts[productId].amount.toFixed(2)})
                                                </div>
                                            </div>
                                        )}

                                        <div className="quantity-wrapper">
                                            <div onClick={() => updateQuantity(line.id, line.quantity - 1)} className="btn-fetcher" disabled={line.quantity <= 1}><img src={minus} /></div>
                                            <div onClick={() => updateQuantity(line.id, line.quantity + 1)} className="btn-fetcher"><img src={plus} /></div>
                                        </div>
                                    </div>

                                    <div className="price-remove-wrapper">
                                        <button onClick={() => removeItem(line.id)} className="remove-btn product">
                                            <img src={deletebtn} alt="Remove" />
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
            </div>

            <div className="cart-page-discount">
                <div className="form-row">
                    <div className={`checkout-input-wraping ${code.trim() ? "active" : ""}`}>
                        <input
                            type="text"
                            className="floating-input"
                            placeholder=""
                            value={code}
                            onChange={e => setCode(e.target.value)}
                        />
                        <label className="floating-label">Discount code</label>
                    </div>
                    <button
                        type="button"
                        className={`apply ${code.trim() ? "active" : ""}`}
                        onClick={handleApply}
                        disabled={loading || code.trim() === ""}
                        style={{
                            background: code.trim() ? checkOutBtnBgColor : "",
                            border: code.trim() ? `1px solid ${checkOutBtnBgColor}` : "1px solid #ccc"
                        }}
                    >
                        {loading ? (
                            <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: 20 }} />
                        ) : (
                            "Apply"
                        )}
                    </button>
                </div>

                <div className={`discount-message error-message ${message && !loading ? "show" : ""} ${success ? "success" : "error"}`}>
                    {message && !loading && <p>{message}</p>}
                </div>

                {appliedCode && (
                    <div className="applied-code">
                        <span>
                            <strong>
                                <img src={discount1} alt="" /> {appliedCode}
                            </strong>
                        </span>
                        <span onClick={handleRemove} style={{ cursor: "pointer" }}>
                            <img src={discross} alt="Remove" />
                        </span>
                    </div>
                )}
                {freeShippingCode && (
                    <div className="applied-code">
                        <span>
                            <strong>
                                <img src={discount1} alt="" /> {freeShippingCode.code}
                            </strong>
                        </span>
                        <span onClick={handleRemoveFreeShipping} style={{ cursor: "pointer" }}>
                            <img src={discross} alt="Remove" />
                        </span>
                    </div>
                )}

            </div>
            <div className='checkout-page-pay-option'>
                <span>Subtotal</span>
                <span>{getCurrencySymbol(currency)}{subtotal.toFixed(2)}</span>
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
                    <span className="discount-amount">
                        -{getCurrencySymbol(currency)}{discountDetails.amount.toFixed(2)}
                    </span>
                </div>
            )}

            <div className='checkout-page-pay-option'>
                <span>Shipping</span>
                <span>
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
                    <span> {getCurrencySymbol(currency)}{totalEstimatedTax.toFixed(2)}</span>
                </div>
            )}

            <div className='checkout-page-pay-option total'>
                <span>Total</span>
                <span>
                    <p>{currency}</p>
                    {getCurrencySymbol(currency)}
                    {(finalTotal + totalEstimatedTax).toFixed(2)}
                </span>
            </div>
        </div>
    );
}
