export default function StepThird({ step, demo, points, showMore, visibleCount, setShowMore, more, handleFreeTrial,
    basic, showPre, visiblePre, setShowPre, handleBasic, loading, loadingDemo, loadingBasic

}) {
    return (
        <div className='store-step-third'>
            {step === 3 && (
                <>
                    <div className="checkout-page-login-h1 payment">
                        <h1 className="checkout-title">Subscription Plans</h1>
                    </div>
                    <span className="checkout-subtitle payment" >Choose the best Plan for you</span>
                    <div className="checkout-subscrpition-selected">
                        <div className="checkout-payment-wrap demo">
                            <div className="payment-title">Free Demo</div>
                            <div className="payment-wrapp">
                                <div className="payment-logo"><img src={demo} alt="" /></div>
                                <div className="payment-subtitle"><span className="subtitle-prcie">$0.00</span>/3 Day Basic Trial</div>
                                <div className="payment-points">
                                    {points.slice(0, showMore ? points.length : visibleCount).map((point, index) => (
                                        <div
                                            key={index}
                                            className="point-item">
                                            <span
                                                className="point-circle"
                                                style={{
                                                    background:
                                                        index === 0 || index === 1
                                                            ? "linear-gradient(112.2deg, #015E6B -65.2%, #E4FCFF 299.18%)"
                                                            : "linear-gradient(288.96deg, #000000 -25.23%, #FFFFFF 103.65%)",
                                                }}
                                            ></span>
                                            <span className="point-text">{point}</span>
                                        </div>
                                    ))}
                                    {points.length > visibleCount && (
                                        <div
                                            className="show-more-btn"
                                            onClick={() => setShowMore(!showMore)}
                                        >
                                            <img
                                                src={more}
                                                alt=""
                                                className={`more-icon ${showMore ? "rotated" : ""}`}
                                            />
                                            {showMore ? "Show Less" : "More"}
                                        </div>
                                    )}
                                </div>

                                <button className="btn-login" onClick={handleFreeTrial} disabled={loadingDemo}>
                                    {loadingDemo ? <i className="fa fa-spinner fa-spin"></i> : "Get Started"}
                                </button>
                            </div>
                        </div>
                        <div className="checkout-payment-wrap">
                            <div className="payment-title">Premium</div>
                            <div className="payment-wrapp">
                                <div className="payment-logo"><img src={basic} alt="" /></div>
                                <div className="payment-subtitle"><span className="subtitle-prcie">$14.99</span>/Monthly</div>
                                <div className="payment-points">
                                    {points.slice(0, showPre ? points.length : visiblePre).map((point, index) => (
                                        <div
                                            key={index}
                                            className="point-item">
                                            <span
                                                className="point-circle"
                                                style={{
                                                    background:
                                                        index === 0 || index === 1
                                                            ? "linear-gradient(112.2deg, #015E6B -65.2%, #E4FCFF 299.18%)"
                                                            : "linear-gradient(288.96deg, #000000 -25.23%, #FFFFFF 103.65%)",
                                                }}
                                            ></span>
                                            <span className="point-text">{point}</span>
                                        </div>
                                    ))}
                                    {points.length > visiblePre && (
                                        <div
                                            className="show-more-btn"
                                            onClick={() => setShowPre(!showPre)}
                                        >
                                            <img
                                                src={more}
                                                alt=""
                                                className={`more-icon ${showPre ? "rotated" : ""}`}
                                            />
                                            {showPre ? "Show Less" : "More"}
                                        </div>
                                    )}
                                </div>
                                <button className="btn-login" onClick={handleBasic} disabled={loadingBasic}>
                                    {loadingBasic ? <i className="fa fa-spinner fa-spin"></i> : "Get Started"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
