export default function Contact({ gapy, pay, error, input, handleChange, shop, customers, contactOptions }) {

    const showPhone = contactOptions?.includes("phone") || contactOptions?.includes("both");
    const showEmail = contactOptions?.includes("email") || contactOptions?.includes("both");

    const getPlaceholder = () => {
        if (showEmail && showPhone) return "Email or Phone number";
        if (showEmail) return "Email";
        if (showPhone) return "Phone number";
        return "Phone number";
    };

    return (
        <div className="checkout-contact checkout-h2">
            <div className='form-row contact-in'>
                <div><h2>Contact</h2></div>
            </div>

            <div className='checkout-input-wraping email'>
                <input
                    type={showPhone && !showEmail ? "tel" : "text"}
                    placeholder=""
                    required
                    value={input}
                    onChange={handleChange}
                    className="floating-input"
                />
                <label htmlFor="floatingInput" className="floating-label">
                    {getPlaceholder()}
                </label>

                {error && <p className="error-message" style={{ color: 'red', fontSize: '11px' }}>{error}</p>}
            </div>

            <div className="custom-checkbox-wrapper">
                <label className="custom-checkbox-label custom">
                    <input type="checkbox" className="custom-checkbox" />
                    <span className="checkbox-text">Email me with news and offers</span>
                </label>
            </div>
        </div>
    );
}
