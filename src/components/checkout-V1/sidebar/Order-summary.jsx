export default function OrderSummary({ toggleProducts, showProducts, getCurrencySymbol,
    finalTotal, totalEstimatedTax,currency }) {
    return (
        <div className="order-summary-wrap" onClick={toggleProducts} style={{ cursor: "pointer" }}>
            <div className="order-summary-wrap-left">
                <h2>Order summary</h2>
                <div className="summary-img">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className={`h-6 ${showProducts ? "rotated" : ""}`}
                        style={{ color: "rgb(0, 0, 0)" }}>
                        <path
                            fillRule="evenodd"
                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </div>
            </div>
            <span>
                {getCurrencySymbol(currency)}
                {(finalTotal + totalEstimatedTax).toFixed(2)}
            </span>
        </div>
    )
}
