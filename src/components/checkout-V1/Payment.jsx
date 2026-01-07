import React, {
  useState, forwardRef, useImperativeHandle, useEffect
} from "react";
import {
  Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";
import wallet from '../../images/wallet.webp';
import upi from '../../images/upi.png';
import cod from '../../images/cod.webp';

const DEFAULT_STRIPE_KEY = "pk_test_12345";
// const stripePromise = loadStripe("pk_test_mkrgIEP3VV4XgdE5OzbaeP6z00yXZXyuOz");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#000",

      "::placeholder": {
        color: "transparent",
      },
    },
    invalid: {
      color: "#fa755a",
    },
  },

  placeholder: "",
};

const InnerPaymentForm = forwardRef(({ paymentOptions, setSelectedPayment, selectedPayment, card1, card2, card3, card4, shopImage, klarna1, Afterpay1,
  useShippingAsBilling, setUseShippingAsBilling, AllowedCountries, billing, box, selectedbilling, showTip, setCardErrors,
  handleCheckboxChange, showRember, handleRember, setSelectedBilling, card6, card10, card5, complete, setComplete,
  card7, handleChangeBilling, billingAddress, cardErrors, CheckoutPaymentOtions
}, ref) => {


  const stripe = useStripe();
  const elements = useElements();
  const [focus, setFocus] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });

  const [isExpiryFocused, setIsExpiryFocused] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const sortedOptions = paymentOptions
      .filter(option => CheckoutPaymentOtions.includes(option.type))
      .sort(
        (a, b) =>
          CheckoutPaymentOtions.indexOf(a.type) -
          CheckoutPaymentOtions.indexOf(b.type)
      );

    if (sortedOptions.length > 0) {
      setSelectedPayment(sortedOptions[0]);
    }
  }, [paymentOptions, CheckoutPaymentOtions]);

  const renderOptionDetails = (option) => {
    switch (option.title) {
      case "Credit card":
        return (
          <div className="credit-card-fields credit-card show">
            <div className={`checkout-input-wraping payment ${(focus.number || complete.number) ? "focused" : ""}`}>
              <CardNumberElement
                className={`floating-input-card form-input ${isExpiryFocused ? "focused" : ""}`}
                options={CARD_ELEMENT_OPTIONS}
                onFocus={() => setFocus(prev => ({ ...prev, number: true }))}
                onBlur={() => setFocus(prev => ({ ...prev, number: false }))}
                onChange={(e) => {
                  setComplete(prev => ({ ...prev, number: e.complete }));
                  setCardErrors(prev => ({ ...prev, number: e.error ? e.error.message : "" }));
                }}
              />
              <label className="floating-labelpayment">Card number</label>
              {cardErrors.number && <p className="error-text">{cardErrors.number}</p>}
            </div>

            <div className="form-row">
              <div className={`checkout-input-wraping payment ${(focus.expiry || complete.expiry) ? "focused" : ""}`}>
                <CardExpiryElement
                  className={`floating-input-card form-input ${isExpiryFocused ? "focused" : ""}`}
                  options={CARD_ELEMENT_OPTIONS}
                  onFocus={() => setFocus(prev => ({ ...prev, expiry: true }))}
                  onBlur={() => setFocus(prev => ({ ...prev, expiry: false }))}
                  onChange={(e) => {
                    setComplete(prev => ({ ...prev, expiry: e.complete }));
                    setCardErrors(prev => ({ ...prev, expiry: e.error ? e.error.message : "" }));
                  }}
                />
                <label className="floating-labelpayment">Expiration date (MM / YY)</label>
                {cardErrors.expiry && <p className="error-text">{cardErrors.expiry}</p>}
              </div>

              <div className={`checkout-input-wraping payment ${(focus.cvc || complete.cvc) ? "focused" : ""}`}>
                <CardCvcElement
                  className={`floating-input-card form-input ${isExpiryFocused ? "focused" : ""}`}
                  options={CARD_ELEMENT_OPTIONS}
                  onFocus={() => setFocus(prev => ({ ...prev, cvc: true }))}
                  onBlur={() => setFocus(prev => ({ ...prev, cvc: false }))}
                  onChange={(e) => {
                    setComplete(prev => ({ ...prev, cvc: e.complete }));
                    setCardErrors(prev => ({ ...prev, cvc: e.error ? e.error.message : "" }));
                  }}
                />
                <label className="floating-labelpayment">Security code</label>
                {cardErrors.cvc && <p className="error-text">{cardErrors.cvc}</p>}
              </div>
            </div>

            <div className='checkout-input-wraping payment '>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
                required
                className="floating-input form-input"
              />
              <label htmlFor="floatingInput" className="floating-label">
                Name on card
              </label>
              <div className="custom-checkbox-wrapper">
                <label className="custom-checkbox-label custom">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={useShippingAsBilling}
                    onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                  />
                  <span className="checkbox-text">Use shipping address as billing address</span>
                </label>
              </div>
              {!useShippingAsBilling && (
                <div className="checkout-contact checkout-h2 card billing-address-section show">
                  <h3 className="checkout-contact-billing">Billing address</h3>
                  <div className="delivery-form-container">
                    <div className="select-wrapper">
                      <div className="form-group">
                        <label htmlFor="country" className="select-label">Country/Region</label>
                        <select
                          id="country"
                          className="select-box"
                          name="country"
                          value={billingAddress.country}
                          onChange={handleChangeBilling}
                        >
                          <option value="">Select a country</option>
                          {AllowedCountries.map((country, index) => (
                            <option key={index} value={country.code}>{country.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className='checkout-input-wraping '>
                        <input type="text" placeholder="" required name="firstName" value={billingAddress.firstName}
                          onChange={handleChangeBilling} className="floating-input" />
                        <label htmlFor="floatingInput" className="floating-label">
                          First name (optional)
                        </label>
                      </div>
                      <div className='checkout-input-wraping '>
                        <input type="text" placeholder="" required name="lastName" value={billingAddress.lastName}
                          onChange={handleChangeBilling} className="floating-input" />
                        <label htmlFor="floatingInput" className="floating-label">
                          Last name
                        </label>
                      </div>
                    </div>

                    <div className='checkout-input-wraping '>
                      <input type="text" placeholder="" required name="address" value={billingAddress.address}
                        onChange={handleChangeBilling} className="floating-input form-input" />
                      <label htmlFor="floatingInput" className="floating-label">
                        Address
                      </label>
                    </div>
                    <div className='checkout-input-wraping '>
                      <input type="text" placeholder="" name="apartment" value={billingAddress.apartment}
                        onChange={handleChangeBilling} className="floating-input form-input" />
                      <label htmlFor="floatingInput" className="floating-label">
                        Apartment, suite, etc. (optional)
                      </label>
                    </div>
                    <div className="form-row">
                      <div className='checkout-input-wraping '>
                        <input type="text" placeholder="" name="postalCode" value={billingAddress.postalCode}
                          onChange={handleChangeBilling} className="floating-input" />
                        <label htmlFor="floatingInput" className="floating-label">
                          Postal code
                        </label>
                      </div>
                      <div className='checkout-input-wraping'>
                        <input type="text" placeholder="" required name="city"
                          value={billingAddress.city}
                          onChange={handleChangeBilling} className="floating-input" />
                        <label htmlFor="floatingInput" className="floating-label">
                          City
                        </label>
                      </div>
                      <div className='checkout-input-wraping'>
                        <input type="text" placeholder="" required name="state"
                          value={billingAddress.state}
                          onChange={handleChangeBilling} className="floating-input" />
                        <label htmlFor="floatingInput" className="floating-label">
                          State
                        </label>
                      </div>
                    </div>
                    <div className='checkout-input-wraping'>
                      <input type="text" placeholder="" required name="phone" value={billingAddress.phone}
                        onChange={handleChangeBilling} className="floating-input last-input" />
                      <label htmlFor="floatingInput" className="floating-label">
                        Phone (optional)
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "Cash on Delivery (COD)":
        return (
          <div className="items-fields">
            <div className="wallet-fields items-payment">
              <div className="wallet-fields-img"><img src={cod} alt="COD" /></div>
              <div className="wallet-field-text">
                <p>
                  Choose COD at checkout and pay in cash when your order arrives. It’s simple, secure, and lets you check your product before paying.
                </p>
              </div>
            </div>
          </div>
        );

      case "Wallets":
        return (
          <div className="items-fields">
            <div className="wallet-fields items-payment">
              <div className="wallet-fields-img"><img src={wallet} alt="Wallet" /></div>
              <div className="wallet-field-text">
                <p>
                  Choose your preferred digital wallet and pay instantly. Supported wallets include Amazon Pay, PhonePe Wallet, Mobikwik, Freecharge, and others.
                </p>
              </div>
            </div>
          </div>
        );

      case "UPI":
        return (
          <div className="items-fields upi">
            <div className="wallet-fields items-payment">
              <div className="wallet-fields-img"><img src={upi} alt="UPI" /></div>
              <div className="wallet-field-text">
                <p>
                  After clicking “Pay Now” you’ll be redirected to a secure UPI payment page. Complete your payment using any UPI app such as Google Pay, PhonePe, Paytm, or BHIM.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useImperativeHandle(ref, () => ({
    async submitPayment() {
      if (!stripe || !elements) {
        return { error: { message: "Stripe not loaded yet." } };
      }

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        return { error: { message: "Card element not found." } };
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name }
      });

      return { error, paymentMethod };
    }
  }));

  const filteredSortedOptions = paymentOptions
    .filter(option => CheckoutPaymentOtions.includes(option.type))
    .sort(
      (a, b) =>
        CheckoutPaymentOtions.indexOf(a.type) -
        CheckoutPaymentOtions.indexOf(b.type)
    );

  return (
    <div className="checkout-contact checkout-h2 payment">
      <h2>Payment</h2>
      <p>All transactions are secure and encrypted.</p>
      {filteredSortedOptions.length > 0 && (
        <div className="checkout-payment shipping-methods">
          {filteredSortedOptions.map((option, index, arr) => (
            <div
              key={option.id}
              className={`checkout-payment-list ${selectedPayment?.id === option.id ? 'selected' : ''}`}
            >
              <label className={`shipping-option ${selectedPayment?.id === option.id ? 'selected' : ''} ${index === arr.length - 1 ? 'no-bottom' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  onChange={() => setSelectedPayment(option)}
                  checked={selectedPayment?.id === option.id}
                />
                <div className="option-box">
                  <span className="option-title img-item">
                    {option.title === "Credit card" ? (
                      <>
                        Credit card
                        <span className="option-price">
                          <img src={card1} alt="" />
                          <img src={card2} alt="" />
                          <img src={card3} alt="" />
                          <img src={card4} alt="" />
                        </span>
                      </>
                    ) : (
                      <div className="shop-card">
                        <div className="shop-left">
                          <span>{option.title}</span>
                        </div>
                      </div>
                    )}
                  </span>
                </div>
              </label>
              {selectedPayment?.id === option.id && renderOptionDetails(option)}
            </div>
          ))}
        </div>
      )}

      {selectedPayment?.title !== "Credit card" && (
        <div className='checkout-page-billing-address'>
          <h3 className='checkout-contact-billing'>Billing address</h3>
          <div className="shipping-methods">
            {billing.map((option, index) => {
              const isDifferentBilling = option.title === "Use a different billing address";
              const isSelected = selectedbilling === index;

              return (
                <div key={index}>
                  <label
                    className={`shipping-option item ${isSelected ? `selected option-${index}` : ""}`}
                  >
                    <input
                      type="radio"
                      name="billing"
                      onChange={() => setSelectedBilling(index)}
                      checked={isSelected}
                    />
                    <div className="option-box">
                      <span className="option-title">{option.title}</span>
                    </div>
                  </label>

                  {isDifferentBilling && (
                    <div className={`delivery-form-container-billing ${isSelected ? "show" : "hide"}`}>
                      <div className="select-wrapper">
                        <div className="form-group">
                          <label htmlFor="country" className="select-label">Country/Region</label>
                          <select
                            id="country"
                            className="select-box"
                            name="country"
                            value={billingAddress.country}
                            onChange={handleChangeBilling}
                          >
                            <option value="">Select a country</option>
                            {AllowedCountries.map((country, index) => (
                              <option key={index} value={country.code}>{country.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className='checkout-input-wraping '>
                          <input type="text" placeholder="" required name="firstName" value={billingAddress.firstName}
                            onChange={handleChangeBilling} className="floating-input" />
                          <label htmlFor="floatingInput" className="floating-label">
                            First name (optional)
                          </label>
                        </div>
                        <div className='checkout-input-wraping '>
                          <input type="text" placeholder="" required name="lastName" value={billingAddress.lastName}
                            onChange={handleChangeBilling} className="floating-input" />
                          <label htmlFor="floatingInput" className="floating-label">
                            Last name
                          </label>
                        </div>
                      </div>

                      <div className='checkout-input-wraping '>
                        <input type="text" placeholder="" required name="address" value={billingAddress.address}
                          onChange={handleChangeBilling} className="floating-input form-input" />
                        <label htmlFor="floatingInput" className="floating-label">
                          Address
                        </label>
                      </div>
                      <div className='checkout-input-wraping '>
                        <input type="text" placeholder="" name="apartment" value={billingAddress.apartment}
                          onChange={handleChangeBilling} className="floating-input form-input" />
                        <label htmlFor="floatingInput" className="floating-label">
                          Apartment, suite, etc. (optional)
                        </label>
                      </div>
                      <div className="form-row">
                        <div className='checkout-input-wraping '>
                          <input type="text" placeholder="" name="postalCode" value={billingAddress.postalCode}
                            onChange={handleChangeBilling} className="floating-input" />
                          <label htmlFor="floatingInput" className="floating-label">
                            Postal code
                          </label>
                        </div>
                        <div className='checkout-input-wraping'>
                          <input type="text" placeholder="" required name="city"
                            value={billingAddress.city}
                            onChange={handleChangeBilling} className="floating-input" />
                          <label htmlFor="floatingInput" className="floating-label">
                            City
                          </label>
                        </div>
                        <div className='checkout-input-wraping'>
                          <input type="text" placeholder="" required name="state"
                            value={billingAddress.state}
                            onChange={handleChangeBilling} className="floating-input" />
                          <label htmlFor="floatingInput" className="floating-label">
                            State
                          </label>
                        </div>
                      </div>
                      <div className='checkout-input-wraping'>
                        <input type="text" placeholder="" required name="phone" value={billingAddress.phone}
                          onChange={handleChangeBilling} className="floating-input last-input" />
                        <label htmlFor="floatingInput" className="floating-label">
                          Phone (optional)
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* {selectedPayment?.title !== "Credit card" && (
        <div className='checkout-page-billing-address ad-trip'>
          <h3 className='checkout-contact-billing'>Add tip</h3>
          <div className={`custom-checkbox-wrapper ${showTip ? 'open' : 'hidden'}`}>

            <label class="custom-checkbox-label">
              <input
                type="checkbox"
                className="custom-checkbox"
                onChange={handleCheckboxChange}
                checked={showTip}
              />
              <span class="checkbox-text">Show your support for the team at Craft Hub</span>
            </label>
            <div
              className={`checkout-page-billing-address-custom ${showTip ? "visible" : "hidden"
                }`}
            >
              <div className='checkout-page-count'>
                <span>
                  <div className='checkout-page-number'>
                    <p> 5%</p>
                    <p> 5.03</p>
                  </div>
                </span>
                <span>
                  <div className='checkout-page-number'>
                    <p> 10%</p>
                    <p> 10.03</p>
                  </div>
                </span>
                <span className='third-checkout-page'>
                  <div className='checkout-page-number'>
                    <p> 15%</p>
                    <p> 15.03</p>
                  </div>
                </span>
              </div>
              <div className="checkout-page-input-field-custom">
                <div className="input-wrapper">
                  <div className='checkout-input-wraping'>
                    <input type="text" placeholder="" required className="floating-input form-input last-input" />
                    <label htmlFor="floatingInput" className="floating-label">
                      Custom trip
                    </label>
                    <div className="input-actions">
                      <button type="button" className="action-btn">-</button>
                      <button type="button" className="action-btn">+</button>
                    </div>
                  </div>
                </div>
                <button className='btn custom'>Add trip</button>
              </div>
              <p>Thank you, we appreciate it.</p>
            </div>

          </div>
        </div>
      )} */}
      {/* {selectedPayment?.title !== "Credit card" && (
        <div className='checkout-page-billing-address ad-trip'>
          <h3 className='checkout-contact-billing'>Remember me</h3>
          <div className={`custom-checkbox-wrapper ${showRember ? 'open' : 'hidden'}`}>

            <label class="custom-checkbox-label">
              <input
                type="checkbox"
                className="custom-checkbox"
                onChange={handleRember}
                checked={showRember}
              />
              <span class="checkbox-text">Save my information for a faster checkout</span>
            </label>
            <div className={`checkout-page-billing-address-custom ${showRember ? "visible" : "hidden"
              }`}>
              <div className="checkout-page-input-field-custom address">

                <div className='checkout-input-wraping'>
                  <input type="text" placeholder="" required className="floating-input" />
                  <label htmlFor="floatingInput" className="floating-label">
                    First Name
                  </label>
                </div>
                <div className='checkout-input-wraping'>
                  <input type="text" placeholder="" required className="floating-input last-input" />
                  <label htmlFor="floatingInput" className="floating-label">
                    Mobile phone number
                  </label>
                </div>

              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
});

const PaymentForm = forwardRef(({ stripePublishableKey, ...props }, ref) => {
  const stripeKey = stripePublishableKey || DEFAULT_STRIPE_KEY;
  const stripePromise = useMemo(() => loadStripe(stripeKey), [stripeKey]);

  return (
    <Elements key={stripeKey} stripe={stripePromise}>
      <InnerPaymentForm {...props} ref={ref} />
    </Elements>
  );
});

export default PaymentForm;