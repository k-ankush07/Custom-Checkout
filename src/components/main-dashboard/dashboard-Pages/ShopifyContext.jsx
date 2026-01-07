import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
const ShopifyContext = createContext();
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export function ShopifyProvider({ children }) {
  const [eventOrders, setEventOrders] = useState(() => {
    const saved = localStorage.getItem("eventOrders");
    return saved ? JSON.parse(saved) : [];
  });
  const [allOrders, setAllOrders] = useState(() => {
    const saved = localStorage.getItem("allOrders");
    return saved ? JSON.parse(saved) : [];
  });
  const [rawAllOrders, setRawAllOrders] = useState(() => {
    const saved = localStorage.getItem("rawAllOrders");
    return saved ? JSON.parse(saved) : [];
  });
  const [filteredCustomers, setFilteredCustomers] = useState(() => {
    const saved = localStorage.getItem("filteredCustomers");
    return saved ? JSON.parse(saved) : [];
  });
  const [allCheckout, setAllCheckout] = useState(() => {
    const saved = localStorage.getItem("allCheckout");
    return saved ? JSON.parse(saved) : [];
  });
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [storefrontToken, setStorefrontToken] = useState(() => {
    return localStorage.getItem("storefrontToken") || "";
  });
  const [rtoOrders, setRtoOrders] = useState([]);
  const [activeShopIndex, setActiveShopIndex] = useState(() => {
    return Number(localStorage.getItem("activeShopIndex") || 0);
  });
  const [shopifyData, setShopifyData] = useState(() => {
    const saved = localStorage.getItem("shopifyData");
    return saved ? JSON.parse(saved) : [];
  });
  const [loginData, setLoginData] = useState([]);
  const [appEmail, setAppEmail] = useState(() => {
    const stored = localStorage.getItem("appEmail");
    return stored && stored !== "undefined" ? stored : "";
  });
  const [appToken, setAppToken] = useState(() => {
    const stored = localStorage.getItem("appToken");
    return stored && stored !== "undefined" ? stored : "";
  });

  const [searchParams] = useSearchParams();
  const searchshop = searchParams.get("shop");

  useEffect(() => {
    const fetchLoginData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/login-data`);
        setLoginData(response.data);
      } catch (error) {
        console.error("Error fetching login data:", error);
      }
    };

    fetchLoginData();
  }, []);

  useEffect(() => { if (appEmail) localStorage.setItem("appEmail", appEmail); }, [appEmail]);
  useEffect(() => { if (appToken) localStorage.setItem("appToken", appToken); }, [appToken]);

  useEffect(() => {
    localStorage.setItem("allOrders", JSON.stringify(allOrders));
  }, [allOrders]);

  useEffect(() => {
    localStorage.setItem("rawAllOrders", JSON.stringify(rawAllOrders));
  }, [rawAllOrders]);

  useEffect(() => {
    localStorage.setItem("filteredCustomers", JSON.stringify(filteredCustomers));
  }, [filteredCustomers]);

  useEffect(() => {
    localStorage.setItem("allCheckout", JSON.stringify(allCheckout));
  }, [allCheckout]);

  useEffect(() => {
    if (shopifyData.length > 0 && loginData.length > 0) {
      const activeShop = shopifyData[activeShopIndex]?.shop;
      const matchedLogin = loginData.find(
        (item) =>
          item.shop?.toLowerCase() === activeShop?.domain?.toLowerCase() &&
          item.email?.toLowerCase() === appEmail?.toLowerCase()
      );

      if (activeShop && matchedLogin) {
        localStorage.setItem("activeShopName", activeShop.name);
        localStorage.setItem("activeShopEmail", activeShop.email);
        localStorage.setItem("activeShopAccessToken", matchedLogin.accessToken);
      } else {
        console.warn("⚠️ No matching shop or login found for index:", activeShopIndex);
      }
    } else {
      console.warn("⚠️ shopifyData or loginData is empty");
    }
  }, [activeShopIndex, shopifyData, loginData]);


  useEffect(() => {
    if (storefrontToken) {
      localStorage.setItem("storefrontToken", storefrontToken);
    }
  }, [storefrontToken]);

  useEffect(() => {
    if (eventOrders.length > 0) {
      localStorage.setItem("eventOrders", JSON.stringify(eventOrders));
    }
  }, [eventOrders]);

  useEffect(() => {
    const activeShop = shopifyData[activeShopIndex]?.shop;
    if (activeShop) {
      localStorage.setItem("shop", activeShop.domain);
    }
  }, [activeShopIndex, shopifyData]);

  useEffect(() => {
    const fetchEventOrders = async () => {

      if (!shopifyData.length || !loginData.length) return;
      const activeShop = shopifyData[activeShopIndex]?.shop;
      const matchedLogin = loginData.find(item => item.shop === activeShop?.domain);
      if (!activeShop || !matchedLogin) return;

      let offset = 0;
      const limit = 5;
      let accumulatedOrders = [...eventOrders];

      while (true) {
        try {
          const response = await axios.post(`${apiBaseUrl}/events-data`, {
            shop: activeShop.domain,
            accessToken: matchedLogin.accessToken,
            offset,
            limit,
          });

          const { orderIds: batchOrders, nextOffset, cached } = response.data;

          if (batchOrders && batchOrders.length > 0) {
            accumulatedOrders = [...new Set([...accumulatedOrders, ...batchOrders])];
            setEventOrders(accumulatedOrders);
          }

          if (cached || !nextOffset) break;
          offset = nextOffset;

        } catch (err) {
          console.error("Error fetching event orders:", err);
          setEventOrders(accumulatedOrders);
          break;
        }
      }
    };

    const timer = setTimeout(fetchEventOrders, 5000);
    return () => clearTimeout(timer);
  }, [activeShopIndex, shopifyData, loginData]);

  useEffect(() => {
    const fetchAllOrders = async () => {

      if (!shopifyData.length || !loginData.length) return;
      const activeShop = shopifyData[activeShopIndex]?.shop;
      const matchedLogin = loginData.find(item => item.shop === activeShop?.domain);
      if (!activeShop || !matchedLogin) return;

      try {
        const response = await axios.post(`${apiBaseUrl}/orders`, {
          shop: activeShop.domain,
          accessToken: matchedLogin.accessToken
        });

        const fetchedOrders = response.data.orders || [];
        setRawAllOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching all orders:", err);
      }
    };

    const timer = setTimeout(fetchAllOrders, 5000);
    return () => clearTimeout(timer);
  }, [activeShopIndex, shopifyData, loginData]);

  useEffect(() => {
    if (eventOrders.length === 0 || rawAllOrders.length === 0) return;

    const filtered = rawAllOrders.filter(order => eventOrders.includes(order.id));
    setAllOrders(filtered);
  }, [eventOrders, rawAllOrders]);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!shopifyData.length || !loginData.length) return;
      const activeShop = shopifyData[activeShopIndex]?.shop;
      const matchedLogin = loginData.find(item => item.shop === activeShop?.domain);
      if (!activeShop || !matchedLogin) return;

      try {
        const response = await axios.post(`${apiBaseUrl}/customers`, {
          shop: activeShop.domain,
          accessToken: matchedLogin.accessToken
        });
        const customers = response.data.customers || [];
        setAllCustomers(customers);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    const timer = setTimeout(fetchCustomers, 5000);
  return () => clearTimeout(timer);
  }, [activeShopIndex, shopifyData, loginData]);

  useEffect(() => {
    if (!allOrders.length || !allCustomers.length) return;

    const customerIdsFromOrders = allOrders.map(order => order.customer?.id).filter(Boolean);
    const matchedCustomers = allCustomers.filter(customer => customerIdsFromOrders.includes(customer.id));

    setFilteredCustomers(matchedCustomers);
  }, [allOrders, allCustomers]);

  useEffect(() => {
    const fetchAllCheckout = async () => {
      if (!shopifyData.length || !loginData.length) return;

      const activeShop = shopifyData[activeShopIndex]?.shop;
      const matchedLogin = loginData.find(item => item.shop === activeShop?.domain);
      if (!activeShop || !matchedLogin) return;

      try {
        const response = await axios.post(`${apiBaseUrl}/checkouts`, {
          shop: activeShop.domain,
          accessToken: matchedLogin.accessToken
        });
        setAllCheckout(response.data.checkouts || []);
      } catch (err) {
        console.error("Error fetching checkouts:", err);
      }
    };

    fetchAllCheckout();
  }, [activeShopIndex, shopifyData, loginData]);

  const handleSelect = async (option) => {
    setSelectedOption(option);
    console.log(option)
  };

  const shop = shopifyData[activeShopIndex]?.shop?.domain || searchshop;
  const email = appEmail;

  useEffect(() => {
    const fetchCurrentOptionAndToken = async () => {
      if (!shop) return;
      try {
        const [resCheckoutV2, resCustomData] = await Promise.all([
          fetch(`${apiBaseUrl}/checkoutV2/option?shop=${shop}`),
          fetch(`${apiBaseUrl}/custom-data/option?shop=${shop}`)
        ]);

        const dataCheckoutV2 = await resCheckoutV2.json().catch(() => null);
        const dataCustomData = await resCustomData.json().catch(() => null);

        let option = null;
        if (dataCheckoutV2?.data?.checkout_option === "pro") option = "pro";
        else if (dataCustomData?.data?.checkout_option === "basic") option = "basic";

        setSelectedOption(option);
        let tokenUrl = null;
        if (option === "pro") tokenUrl = `${apiBaseUrl}/checkoutV2-data?shop=${encodeURIComponent(shop)}`;
        else if (option === "basic") tokenUrl = `${apiBaseUrl}/custom-data?shop=${encodeURIComponent(shop)}`;

        if (tokenUrl) {
          const tokenRes = await fetch(tokenUrl);
          const tokenData = await tokenRes.json().catch(() => null);

          const token = tokenData?.data?.storefrontToken || tokenData?.storefrontToken || "";
          const fetchedEmail = tokenData?.data?.email || tokenData?.email || appEmail;
          const accessTokenFromServer = tokenData?.data?.accessToken || tokenData?.accessToken || "";

          if (token) setStorefrontToken(token);
          if (fetchedEmail) setAppEmail(fetchedEmail);
          if (accessTokenFromServer) setAppToken(accessTokenFromServer);
          localStorage.setItem("storefrontToken", token);
        }

      } catch (err) {
        console.error("Error fetching checkout option or token:", err);
      }
    };

    fetchCurrentOptionAndToken();
  }, [shop]);

  useEffect(() => {
    const fetchRtoOrders = async () => {
      if (!shopifyData.length || !loginData.length) return;
      const activeShop = shopifyData[activeShopIndex]?.shop;
      const matchedLogin = loginData.find(item => item.shop === activeShop?.domain);
      if (!activeShop || !matchedLogin) return;

      try {
        const response = await axios.post(`${apiBaseUrl}/rto-orders`, {
          shop: activeShop.domain,
          accessToken: matchedLogin.accessToken
        });

        const fetchedRtoOrders = response.data.rtoOrders || [];
        setRtoOrders(fetchedRtoOrders);
      } catch (err) {
        console.error("Error fetching RTO orders:", err);
      }
    };

    fetchRtoOrders();
  }, [activeShopIndex, shopifyData, loginData]);

  const activeShop = shopifyData[activeShopIndex]?.shop || searchshop;
  const matchedLogin = loginData.find(
    (item) =>
      item.shop?.toLowerCase() === activeShop?.domain?.toLowerCase() &&
      item.email?.toLowerCase() === appEmail?.toLowerCase()
  );
  const computedAccessToken = useMemo(() => appToken || matchedLogin?.accessToken || "", [appToken, matchedLogin]);
  const savedToken = localStorage.getItem("activeShopAccessToken");

  const value = useMemo(() => ({
    eventOrders, allOrders, filteredCustomers, allCheckout, activeShopIndex, setActiveShopIndex,
    setShopifyData, shopifyData, shop: shopifyData[activeShopIndex]?.shop?.domain || searchshop,
    email: appEmail,
    ownerShop: shopifyData[activeShopIndex]?.shop?.shop_owner || null,
    accessToken: savedToken || computedAccessToken,
    selectedOption, activeShop, handleSelect, setSelectedOption, apiBaseUrl, storefrontToken,
    setStorefrontToken, rtoOrders,
  }), [
    eventOrders, allOrders, filteredCustomers, allCheckout, activeShopIndex, shopifyData,
    setActiveShopIndex, setShopifyData, selectedOption, setSelectedOption, matchedLogin, rtoOrders,
    computedAccessToken, appEmail
  ]);

  return <ShopifyContext.Provider value={value}>{children}</ShopifyContext.Provider>;
}

export function useShopify() {
  return useContext(ShopifyContext);
}