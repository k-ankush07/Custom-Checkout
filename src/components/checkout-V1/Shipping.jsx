import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function Shipping({ selectedShipping, currency, setSelectedShipping, shipping, pin, selectedCountry,
  selectedProvince, getCurrencySymbol, discounts, finalTotal, totalEstimatedTax, appliedCode, productDiscounts,
  freeShippingCode, cartData
}) {
  const [currencyRates, setCurrencyRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [showShippingOptions, setShowShippingOptions] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(
          "https://api.unirateapi.com/api/rates",
          {
            params: {
              api_key: "fd4zbA40dtNfpRzWnNg2hK3f4r0dBWEDOe3OfW1skaU2GBCOxltg0Q0KlwknSnfm",
              from: "INR"
            }
          }
        );
        setCurrencyRates(response.data.rates);
      } catch (error) {
        console.error("Failed to fetch currency rates:", error);
      }
    };
    fetchRates();
  }, []);

  const matchedZones = useMemo(() => {
    return shipping.filter(zone => zone.code === selectedCountry);
  }, [shipping, selectedCountry]);

  const shippingOptions = useMemo(() => {
    return matchedZones.flatMap(zone =>
      (zone.price_based_shipping_rates || []).map(rate => ({
        title: rate.name,
        price: parseFloat(rate.price).toFixed(2),
        id: rate.id
      }))
    );
  }, [matchedZones]);

  useEffect(() => {
    if (!pin || !selectedProvince) {
      setSelectedShipping(null);
      setShowShippingOptions(false);
    }
  }, [pin, selectedProvince]);

  useEffect(() => {
    if (pin && !selectedShipping && shippingOptions.length > 0) {
      setSelectedShipping(shippingOptions[0]);
    }
  }, [pin, shippingOptions, selectedShipping, setSelectedShipping]);

  useEffect(() => {
    if (pin && shippingOptions.length > 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        setShowShippingOptions(true);
        setLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [pin, shippingOptions]);

  if (!pin) {
    return (
      <div className="checkout-contact checkout-h2 default-shiping">
        <h3>Shipping method</h3>
        <p>Enter your shipping address to view available shipping methods.</p>
      </div>
    );
  }

  return (
    <div className="checkout-contact checkout-h2">
      <h3>Shipping method</h3>
      <div className="shipping-methods shipping">
        {loading ? (
          <div className="skeleton-wrapper fade-in">
            <div className="skeleton" style={{ width: "80%", height: "40px" }}></div>
          </div>
        ) : showShippingOptions ? (
          shippingOptions.length > 0 ? (
            shippingOptions.map((option, index) => (
              <label
                key={option.id}
                className={`shipping-option ${selectedShipping?.id === option.id ? `selected option-${index}` : ""}`}
              >
                <input
                  type="radio"
                  name="shipping"
                  onChange={() => setSelectedShipping(option)}
                  checked={selectedShipping?.id === option.id}
                />
                <div className="option-box">
                  <span className="option-title">{option.title}</span>
                  <span className="option-price">
                    {(() => {
                      const basePrice = parseFloat(option.price);
                      const rate = currencyRates[currency] || 1;
                      const converted = (basePrice * rate).toFixed(2);
                      const symbol = getCurrencySymbol(currency);
                      const countryCode = selectedCountry?.toUpperCase?.();

                      if (parseFloat(converted) === 0) return "Free";

                      const hasProductDiscount = productDiscounts && Object.keys(productDiscounts).length > 0;

                      if (appliedCode || hasProductDiscount) return `${symbol}${converted}`;

                      const hasFreeShipping =
                        (freeShippingCode?.applied &&
                          ((finalTotal + totalEstimatedTax) >= (freeShippingCode?.minSubtotal || 0))) ||

                        discounts?.some(d => {
                          const discount = d?.node?.discount;

                          if (
                            discount?.__typename !== "DiscountAutomaticFreeShipping" ||
                            discount?.status !== "ACTIVE"
                          ) return false;

                          const subtotalReq = parseFloat(
                            discount?.minimumRequirement?.greaterThanOrEqualToSubtotal?.amount || 0
                          );
                          const quantityReq = parseInt(
                            discount?.minimumRequirement?.greaterThanOrEqualToQuantity || 0
                          );

                          const totalQuantity = cartData?.lines?.edges?.reduce((sum, item) => {
                            return sum + (item?.node?.quantity || 0);
                          }, 0);

                          const meetsSubtotal = subtotalReq > 0
                            ? (finalTotal + totalEstimatedTax) >= subtotalReq
                            : false;

                          const meetsQuantity = quantityReq > 0
                            ? totalQuantity >= quantityReq
                            : false;

                          return meetsSubtotal || meetsQuantity;
                        });

                      if (hasFreeShipping) {
                        return (
                          <>
                            <span style={{ textDecoration: "line-through" }}>
                              {symbol}{converted}
                            </span>
                            <span>Free</span>
                          </>
                        );
                      }

                      return `${symbol}${converted}`;
                    })()}
                  </span>

                </div>
              </label>
            ))
          ) : (
            <p>No shipping options available for the selected country.</p>
          )
        ) : null}
      </div>
    </div>
  );
}
