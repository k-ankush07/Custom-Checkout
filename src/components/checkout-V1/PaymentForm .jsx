import React, { forwardRef } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import InnerPaymentForm from "./payment";

const PaymentForm = forwardRef(({ stripePublishableKey, ...props }, ref) => {
  const stripePromise = loadStripe(stripePublishableKey);
  return (
    <Elements stripe={stripePromise}>
      <InnerPaymentForm {...props} ref={ref} />
    </Elements>
  );
});

export default PaymentForm;
 