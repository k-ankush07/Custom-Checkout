export default function StepTwo({ step, token, accrss, accessToken, setAccessToken, handleNext,
    error, Frame, loading }) {

    return (
        <div className="store-step-two">
            {step === 2 && (
                <><div className="store-image">
                    <img src={token} alt="" />
                </div>
                    <div className="checkout-page-login-h1 store">
                        <h1 className="checkout-title">Get Started</h1>
                    </div>
                    <span className="checkout-subtitle">Add Store</span>
                    <div className="store-input-wrapp">
                        <div className="store-page">
                            <label>App Token</label>
                            <div className="login-email-wrapp">
                                <div className="login-details-input">
                                    <img src={accrss} alt="" className="email-img" />
                                    <input
                                        type="text"
                                        value={accessToken}
                                        placeholder="Access Token"
                                        onChange={(e) => setAccessToken(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                className="btn-login"
                                onClick={handleNext}
                                disabled={loading || !accessToken}
                            >
                                {loading ? <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> : "Next"}
                            </button>

                            {error && <p className="error-login-page" style={{ color: "red" }}>{error}</p>}
                        </div>
                        <div className="store-details">
                            <div className="store-domain">
                                <img src={Frame} alt="" />
                                <p>How to Get and Use Shopify Access Token?</p>
                            </div>
                            <div className="store-built">
                                <div className="point">1. How to Get and Use Shopify Access Token?</div>
                                <div className="point">2. Create a custom app and configure required API  scopes.</div>
                                <div className="point">3. 3. Install the app to generate the Access Token.</div>
                                <div className="point">4. Use the token in API requests to access store data.</div>
                                <div className="point">5. Keep it secure; revoke or regenerate if compromised.</div>
                            </div>
                            <div className="store-video">
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
