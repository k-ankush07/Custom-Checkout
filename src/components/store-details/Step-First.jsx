export default function StepFirst({ step, store, Group, storeUrl, setStoreUrl, setError, error, handleNext,
   Frame,loading }) {

  return (
    <div className="store-step-first">
      {step === 1 && (
        <div>
          <div className="store-image">
            <img src={store} alt="store" />
          </div>
          <div className="checkout-page-login-h1 store">
            <h1 className="checkout-title">Get Started</h1>
          </div>
          <span className="checkout-subtitle">Add Store</span>
          <div className="store-input-wrapp">
            <div className="store-page">
              <label>Store (must be .myshopify.com)</label>
              <div className="login-email-wrapp">
                <div className="login-details-input">
                  <img src={Group} alt="" className="email-img" />
                  <input
                    type="text"
                    value={storeUrl}
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      setStoreUrl(value);
                      if (value && !value.endsWith(".myshopify.com")) {
                        setError(" Store URL must end with .myshopify.com");
                      } else {
                        setError("");
                      }
                    }}
                    placeholder="Store (must be .myshopify.com)"
                  />
                </div>
              </div>
              <button
                type="button"
                className={`btn-login store ${storeUrl ? (!error ? "valid" : "invalid") : "empty"}`}
                onClick={handleNext}
                disabled={loading || !storeUrl || !!error}>
                {loading ? <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> : "Next"}
              </button>
            </div>
            <div className="store-details">
              <div className="store-domain">
                <img src={Frame} alt="" />
                <p>Where do I obtain the domain?</p>
              </div>
              <div className="store-built">
                <div className="point">
                  1. Inside your Shopify Admin click on Settings.
                </div>
                <div className="point">2. Head to the Domains section.</div>
                <div className="point">3. Copy your myshopify.com domain.</div>
                <div className="point">
                  4. Paste your myshopify.com domain above.
                </div>
              </div>
              <div className="store-video"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}