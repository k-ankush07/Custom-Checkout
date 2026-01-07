import React, { createContext, useContext, useEffect, useState } from "react";
import { useShopify } from "../main-dashboard/dashboard-Pages/ShopifyContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export const CartProvider = ({ children }) => {
  const { shop, accessToken, storefrontToken } = useShopify();

  const loadFromStorage = (key, defaultValue = []) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [cartData, setCartData] = useState(() =>
    loadFromStorage("cartData", null)
  );
  const [discounts, setDiscounts] = useState(() =>
    loadFromStorage("discounts")
  );
  
  const [shipping, setShipping] = useState(() => loadFromStorage("shipping"));
  const [products, setProducts] = useState(() => loadFromStorage("products"));
  const [taxCountries, setTaxCountries] = useState(() =>
    loadFromStorage("taxCountries")
  );
  const [localizationData, setLocalizationData] = useState(() =>
    loadFromStorage("localizationData")
  );

  const [showSpinnerLineId, setShowSpinnerLineId] = useState(null);
  const [spinnerActionType, setSpinnerActionType] = useState(null);
  const [loadingCartData, setLoadingCartData] = useState(false);

  useEffect(() => {
    if (cartData) localStorage.setItem("cartData", JSON.stringify(cartData));
  }, [cartData]);

  useEffect(() => {
    if (discounts.length > 0)
      localStorage.setItem("discounts", JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => {
    if (shipping.length > 0)
      localStorage.setItem("shipping", JSON.stringify(shipping));
  }, [shipping]);

  useEffect(() => {
    if (products.length > 0)
      localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (taxCountries.length > 0)
      localStorage.setItem("taxCountries", JSON.stringify(taxCountries));
  }, [taxCountries]);

  useEffect(() => {
    localStorage.setItem("localizationData", JSON.stringify(localizationData));
  }, [localizationData]);

  useEffect(() => {
    if (localizationData.length > 0) return;

    const fetchLocalization = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/get-localization`);
        const result = await response.json();
        if (result?.data) setLocalizationData(result.data);
      } catch (error) {
        console.error("❌ Error fetching localization:", error);
      }
    };

    fetchLocalization();
  }, [apiBaseUrl, localizationData.length]);

  const getCart = async (token) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartToken: token,
          shop,
          accessToken,
          storefrontToken,
        }),
      });
      return await res.json();
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      return null;
    }
  };

  const getDiscounts = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/discounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, accessToken }),
      });
      const data = await res.json();
      return data?.discounts || [];
    } catch (err) {
      console.error("Failed to fetch discounts:", err);
      return [];
    }
  };

  const getShipping = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/shipping-zones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, accessToken }),
      });
      const data = await res.json();
      return data?.countries || [];
    } catch (err) {
      console.error("Failed to fetch shipping zones:", err);
      return [];
    }
  };

  const getProducts = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, accessToken }),
      });
      const data = await res.json();
      return data?.products || [];
    } catch (err) {
      console.error("Failed to fetch products:", err);
      return [];
    }
  };

  const getTaxCountries = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/tax-countries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, accessToken }),
      });
      const data = await res.json();
      return data?.countries || [];
    } catch (err) {
      console.error("Failed to fetch tax countries:", err);
      return [];
    }
  };

  const refreshCart = async () => {
    const token = new URLSearchParams(window.location.search).get("cart_token");
    if (!token) return;

    setLoadingCartData(true);
    const updatedCart = await getCart(token);
    if (updatedCart) setCartData(updatedCart);
    setLoadingCartData(false);
  };

  const updateQuantity = async (lineId, newQty) => {
    if (!cartData?.id) return;

    setShowSpinnerLineId(lineId);
    setSpinnerActionType("update");

    try {
      await fetch(`${apiBaseUrl}/api/cart/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartData.id,
          lineId,
          quantity: newQty,
          shop,
          accessToken,
          storefrontToken,
        }),
      });

      refreshCart();
    } catch (err) {
      console.error("❌ Failed to update quantity:", err);
    } finally {
      setShowSpinnerLineId(null);
      setSpinnerActionType(null);
    }
  };

  const removeItem = async (lineId) => {
    if (!cartData?.id) return;

    setShowSpinnerLineId(lineId);
    setSpinnerActionType("update");

    try {
      await fetch(`${apiBaseUrl}/api/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartData.id,
          lineId,
          shop,
          accessToken,
          storefrontToken,
        }),
      });
      refreshCart();
    } catch (err) {
      console.error("❌ Failed to remove item:", err);
    } finally {
      setShowSpinnerLineId(null);
      setSpinnerActionType(null);
    }
  };

  useEffect(() => {
    if (!shop || !accessToken || !storefrontToken) return;

    const token = new URLSearchParams(window.location.search).get("cart_token");

    if (token) {
      getCart(token).then((data) => {
        if (data) setCartData(data);
      });
    }

    const fetchAllData = async () => {
      try {
        const shippingData = await getShipping();
        setShipping(shippingData);

        const discountsData = await getDiscounts();
        setDiscounts(discountsData);

        const taxCountriesData = await getTaxCountries();
        setTaxCountries(taxCountriesData);

        const productsData = await getProducts();
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch cart-related data:", err);
      }
    };

    fetchAllData();
  }, [shop, accessToken, storefrontToken]);

  return (
    <CartContext.Provider
      value={{
        cartData, discounts, shipping, products, taxCountries, refreshCart,
        updateQuantity, removeItem, showSpinnerLineId, setShowSpinnerLineId,
        spinnerActionType, setSpinnerActionType, shop, accessToken, localizationData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};