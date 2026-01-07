import React, { useState, forwardRef, useImperativeHandle, useMemo } from "react";
import {
  Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const DEFAULT_STRIPE_KEY = "pk_test_12345";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "15px",          
      color: "#000",
      "::placeholder": {
        color: "#aaa",           
        fontSize: "15px" 
      }
    },
    invalid: {
      color: "#fa755a"
    }
  }
};

const PaymentCard = forwardRef((props, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [focus, setFocus] = useState({ number: false, expiry: false, cvc: false });
  const [name, setName] = useState("");
  const [cardErrors, setCardErrors] = useState({ number: "", expiry: "", cvc: "" });
  const [complete, setComplete] = useState({ number: false, expiry: false, cvc: false });

  useImperativeHandle(ref, () => ({
    stripe,
    elements,
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

  return (
    <div className="credit-card-fields-checkout-payment card-payment">
      <div className={`checkout-input-wraping payment ${focus.number || complete.number ? "focused" : ""}`}>
        <label className="checkout-card-lable">Card number</label>
        <CardNumberElement
          className="floating-input-card form-input"
          options={{
            ...CARD_ELEMENT_OPTIONS,
            placeholder: "XXXXXXXXXXX4321"
          }}
          onFocus={() => setFocus(p => ({ ...p, number: true }))}
          onBlur={() => setFocus(p => ({ ...p, number: false }))}
          onChange={e => {
            setComplete(p => ({ ...p, number: e.complete }));
            setCardErrors(p => ({ ...p, number: e.error?.message || "" }));
          }}
        />
        {cardErrors.number && <p className="error-text">{cardErrors.number}</p>}
      </div>

      <div className="form-row">
        <div className={`checkout-input-wraping payment ${focus.expiry || complete.expiry ? "focused" : ""}`}>
          <label className="checkout-card-lable">Expiry Date</label>
          <CardExpiryElement
            className="floating-input-card form-input"
            options={{
              ...CARD_ELEMENT_OPTIONS,
              placeholder: "MM/YY"
            }}
            onFocus={() => setFocus(p => ({ ...p, expiry: true }))}
            onBlur={() => setFocus(p => ({ ...p, expiry: false }))}
            onChange={e => {
              setComplete(p => ({ ...p, expiry: e.complete }));
              setCardErrors(p => ({ ...p, expiry: e.error?.message || "" }));
            }}
          />

          {cardErrors.expiry && <p className="error-text">{cardErrors.expiry}</p>}
        </div>

        <div className={`checkout-input-wraping payment ${focus.cvc || complete.cvc ? "focused" : ""}`}>
          <label className="checkout-card-lable">CVC / CVV</label>
          <CardCvcElement
            className="floating-input-card form-input"
            options={{
              ...CARD_ELEMENT_OPTIONS,
              placeholder: "CVC"
            }}
            onFocus={() => setFocus(p => ({ ...p, cvc: true }))}
            onBlur={() => setFocus(p => ({ ...p, cvc: false }))}
            onChange={e => {
              setComplete(p => ({ ...p, cvc: e.complete }));
              setCardErrors(p => ({ ...p, cvc: e.error?.message || "" }));
            }}
          />
          {cardErrors.cvc && <p className="error-text">{cardErrors.cvc}</p>}
        </div>
      </div>

      <div className="checkout-input-wraping payment">
          <label className="checkout-card-lable">Card Holder’s Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name..."
          required
          className="floating-input form-input"
        />
      </div>
    </div>
  );
});

const PaymentCardV2 = forwardRef(({ stripePublishableKey, ...props }, ref) => {
  const stripeKey = stripePublishableKey || DEFAULT_STRIPE_KEY;
  const stripePromise = useMemo(() => loadStripe(stripeKey), [stripeKey]);

  return (
    <Elements key={stripeKey} stripe={stripePromise}>
      <PaymentCard {...props} ref={ref} />
    </Elements>
  );
});

export default PaymentCardV2;