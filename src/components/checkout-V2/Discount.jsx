import discountItem from '../../images/discountItem.png';
import check from '../../images/check1.webp';

export default function ({ code, setCode, handleApply, loading, message, success, appliedCode, discount, handleRemove,
    crossbtn, freeShippingCode, handleRemoveFreeShipping, discountDetails, getCurrencySymbol, currency

}) {

    return (
        <div className="checkout-offer checkout-v2">
            {!appliedCode && <h5>Offer & Rewards</h5>}
            <div className="cart-page-discount">
                <div className="form-row">
                    {!appliedCode && !freeShippingCode && (
                        <div className={`checkout-input-wraping ${code.trim() ? "active" : ""}`}>
                            <div className='checkout-add-img'>
                                <img src={discountItem} alt="" />
                            </div>
                            <input
                                type="text"
                                className="floating-input"
                                placeholder=""
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                onFocus={e => e.currentTarget.parentElement.classList.add('active')}
                                onBlur={e => {
                                    if (!e.target.value.trim()) {
                                        e.currentTarget.parentElement.classList.remove('active');
                                    }
                                }}
                            />
                            <label className="floating-label">Enter Coupon Code</label>

                            {code.trim() && (
                                <button
                                    type="button"
                                    className="apply active"
                                    onClick={handleApply}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: 20 }} />
                                    ) : (
                                        "Apply"
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className={`discount-message error-message ${message && !loading ? "show" : ""} ${success ? "success" : "error"}`}>
                    {message && !loading && <p>{message}</p>}
                </div>

                {(appliedCode || freeShippingCode) && (
                    <div className="applied-code">
                        {!freeShippingCode && (
                            <div className='code-drop-down'>
                                {discountDetails.code && (
                                    <div className="discount-amount-checkout-item">
                                        <p>
                                            You Saved {getCurrencySymbol(currency)}
                                            {discountDetails.amount.toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {appliedCode && (
                            <span className='item-wrap-discount'>
                                <div className='code-image-applied'>
                                    <div className='applied-code-image'><img src={check} alt="" /></div>
                                    <p> "{appliedCode}" applied</p>
                                </div>
                                <div className='applied-btn-wrapp' onClick={handleRemove} style={{ cursor: "pointer" }}>
                                    <p>Remove</p>
                                </div>
                            </span>
                        )}

                        {freeShippingCode && (
                            <span className='item-wrap-discount freeShipping'>
                                <div className='code-image-applied'>
                                    <div className='applied-code-image'><img src={check} alt="" /></div>
                                    <p> "{freeShippingCode.code}" applied</p>
                                </div>
                                <div className='applied-btn-wrapp' onClick={handleRemoveFreeShipping} style={{ cursor: "pointer" }}>
                                    <p>Remove</p>
                                </div>
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>

    )
}
