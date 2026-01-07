import React from "react";
import axios from "axios";
import AllowedCountries from './components/checkout-V1/Countries';
import { useState, useEffect, useRef } from "react";
import { countries } from "country-data";
import { useLocation } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import card1 from './images/visa.sxIq5Dot (1).svg';
import card2 from './images/mastercard.1c4_lyMp.svg';
import card3 from './images/amex.Csr7hRoy.svg';
import card4 from './images/discover.C7UbFpNb.svg';
import card5 from './images/5.png';
import card6 from './images/6.png';
import card7 from './images/7.png';
import card10 from './images/10.png';
import blackreview from './images/review.webp';
import blackproduct from './images/product.webp';
import blackvideo from './images/video.webp';
import blackhurryUp from './images/hurryUp.webp';
import discount1 from './images/discount1.webp';
import deletebtn from './images/delete.webp';
import plus from './images/plus.webp';
import minus from './images/minus.webp';
import discross from './images/discross.webp';
import blackmulticolumn from './images/multicolumn.webp';
import whitereview from './images/whitereview.webp';
import whiteproduct from './images/whiteproduct.webp';
import whitevideo from './images/whitevideo.webp';
import whitehurryUp from './images/whitehurryUp.webp';
import whitemulticolumn from './images/whitemulticolumn.webp';
import richBlack from './images/rich.webp';
import whiterich from './images/richwhite.webp';
import searchicon from './images/searchicon.png';
import shopImage from './images/9.png';
import crossbtn from './images/unnamed.png';
import Afterpay1 from './images/unnamed (12).png';
import klarna1 from './images/8.png';
import box from './images/11.svg';
import gapy from './images/gapy1.png';
import pay from './images/pay1.png';
import thankuu from './images/thankuu.png';
import discount from './images/discount.png';
import Contact from './components/checkout-V1/Contact';
import Delivery from './components/checkout-V1/Delivery';
import Shipping from './components/checkout-V1/Shipping';
import Product from './components/checkout-V1/Product';
import Buy from "./components/checkout-V1/Buy";
import ReviewProduct from './components/checkout-V1/sidebar/Review-product';
import ReviewText from './components/checkout-V1/sidebar/Review-text';
import ReviewVideo from './components/checkout-V1/sidebar/Review-video';
import UrgencyBar from './components/checkout-V1/sidebar/UrgencyBar';
import TrustBages from './components/checkout-V1/sidebar/Trust-bages';
import RichText from "./components/checkout-V1/sidebar/RichText";
import Bar from './components/checkout-V1/sidebar/Bar';
import Banner from "./components/checkout-V1/Banner";
import Thankyou from './components/checkout-V1/Thankyou';
import Sidebar from './components/checkout-V1/sidebar/Sidebar';
import { useCart } from "./components/checkout-V1/CartContext";
import SkeletonPage from "./components/loader/Skeleton-page";
import OrderSummary from "./components/checkout-V1/sidebar/Order-summary";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const paymentOptions = [
  { id: 1, title: "Credit card", type: "card" },
  { id: 2, title: "Cash on Delivery (COD)", type: "cash" },
  { id: 3, title: "Wallets", type: "wallet" },
  { id: 4, title: "UPI", type: "upi" },
];

const billing = [
  { title: "Same as shipping address", },
  { title: "Use a different billing address", }
];

const sections = [
  "review",
  "product",
  "video",
  "urgencyBar",
  "trustBages",
  "richtext"
];

const sectionsWithImagesBlack = {
  review: blackreview,
  product: blackproduct,
  video: blackvideo,
  urgencyBar: blackhurryUp,
  trustBages: blackmulticolumn,
  richtext: richBlack
};

const sectionsWithImagesWhite = {
  review: whitereview,
  product: whiteproduct,
  video: whitevideo,
  urgencyBar: whitehurryUp,
  trustBages: whitemulticolumn,
  richtext: whiterich
};

export default function Layout() {
  const { cartData, discounts, shipping, products, taxCountries, updateQuantity, removeItem, localizationData,
    showSpinnerLineId, setShowSpinnerLineId, setSpinnerActionType, spinnerActionType, refreshCart,
    shop, accessToken } = useCart();
  const [selectedProducts, setSelectedProducts] = useState(() => {
    const saved = localStorage.getItem("selectedProducts");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedbar, setSelectedBar] = useState([]);
  const [selectedbages, setSelectedbages] = useState([]);
  const [reviewInputs, setReviewInputs] = useState([]);
  const [richInputs, setRichInputs] = useState([])
  const [videoInputs, setVideoInputs] = useState({ videos: [""], display: 'slider', itemsPerRow: 2, heading: '' });
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [selectedbilling, setSelectedBilling] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [showRember, setRember] = useState(false);
  const [showNumber, setNumber] = useState(false);
  const [pinFormatError, setPinFormatError] = useState("");
  const [pinProvinceError, setPinProvinceError] = useState("");
  const [provinceError, setProvinceError] = useState('');
  const [pinError, setPinError] = useState("");
  const [stripePaymentMethod, setStripePaymentMethod] = useState(null);
  const [showThankyouPage, setShowThankyouPage] = useState(false);
  const [selectedSections, setSelectedSections] = useState([]);
  const [productStyle, setProductStyle] = useState("slider");
  const [bagesStyle, setBagesStyle] = useState("slider");
  const [gridPerSlide, setGridPerSlide] = useState(1);
  const [gridItemsPerRow, setGridItemsPerRow] = useState(2);
  const [saveData, setSaveData] = useState(false);
  const [sectionPositions, setSectionPositions] = useState({
    product: 'last',
    review: 'last',
    video: 'last',
    urgencyBar: 'last',
    trustBages: 'last',
    richtext: 'last',
  });
  const [productHeading, setProductHeading] = useState("");
  const [freeShippingCode, setFreeShippingCode] = useState(null);
  const [activeTab, setActiveTab] = useState("checkout");
  const [activeSetting, setActiveSetting] = useState("");
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [razorpayID, setRazorpayID] = useState("");
  const [razorpayKey, setRazorpayKey] = useState("");
  const [storefrontToken, setStorefrontToken] = useState(() => {
    return localStorage.getItem("storefrontToken") || "";
  });
  const [logo, setLogo] = useState("");
  const [hideLogo, setHideLogo] = useState(false);
  const [sidelogo, setSideLogo] = useState("");
  const [hideSideLogo, setSideHideLogo] = useState(false);
  const [bgColor, setBgColor] = useState(() => localStorage.getItem("bgColor") || "#fff");
  const [bgImage, setBgImage] = useState(() => localStorage.getItem("bgImage") || "");
  const [upiId, setUpiId] = useState("");
  const [checkOutBtnBgColor, setCheckOutBtnBgColor] = useState('#2b737d');
  const [CheckoutPaymentOtions, setCheckoutPaymentOtions] = useState([paymentOptions[0].type]);
  const savedOptions = localStorage.getItem("contactOptions");
  const initialOptions = savedOptions ? JSON.parse(savedOptions) : ["phone"];
  const [contactOptions, setContactOptions] = useState(initialOptions);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showProducts, setShowProducts] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [hiddenSections, setHiddenSections] = useState([]);
  const [sideBarSection, setSideBarSection] = useState(false);
  const [selectedOption, setSelectedOption] = useState(() => {
    return localStorage.getItem("selectedOption") || null;
  });
  const [customData, setCustomData] = useState(null);

  const toggleProducts = () => {
    setShowProducts((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("bgColor", bgColor);
  }, [bgColor]);

  useEffect(() => {
    localStorage.setItem("bgImage", bgImage);
  }, [bgImage]);

  const location = useLocation();
  const isCheckoutPage = location.pathname === "/checkout";

  useEffect(() => {
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedSections", JSON.stringify(selectedSections));
    }
  }, [selectedSections]);

  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('selectedCountry') || "IN";
    }
    return '';
  });

  const [currency, setCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("currency") || '';
    }
    return '';
  });

  useEffect(() => {
    if (!cartData?.buyerIdentity?.countryCode || !localizationData?.length) return;

    const cartCountryCode = cartData.buyerIdentity.countryCode;
    const match = localizationData.find(item => item.countryCode === cartCountryCode);

    if (match) {

      setSelectedCountry(cartCountryCode);
      setCurrency(match.currencyCode);

      localStorage.setItem("selectedCountry", cartCountryCode);
      localStorage.setItem("currency", match.currencyCode);
    }
  }, [cartData, localizationData]);

  useEffect(() => {
    if (!selectedCountry || !localizationData?.length) return;

    const match = localizationData.find(item => item.countryCode === selectedCountry);

    if (match && match.currencyCode !== currency) {
      setCurrency(match.currencyCode);
      localStorage.setItem("currency", match.currencyCode);
      localStorage.setItem("selectedCountry", selectedCountry);
    }
  }, [selectedCountry, localizationData, currency]);

  const getCurrencySymbol = () => {
    if (!selectedCountry || !localizationData?.length) return "";

    const match = localizationData.find(item => item.countryCode === selectedCountry);

    if (match?.currencySign) return match.currencySign;
    return match?.currencyCode ? getSymbolFromCurrency(match.currencyCode) : "";
  };

  const [selectedProvince, setSelectedProvince] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('selectedProvince') || '';
    }
    return '';
  });

  const [pin, setPin] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('pin') || '';
    }
    return '';
  });

  const [deliveryData, setDeliveryData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deliveryData');
      return saved ? JSON.parse(saved) : {
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        phone: ''
      };
    }
    return {
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      phone: ''
    };
  });
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [addressQuery, setAddressQuery] = useState(deliveryData.address || "");
  const [billingAddress, setBillingAddress] = useState({
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    postalCode: "",
    city: "",
    state: "",
    phone: "",
  });

  const handleChangeBilling = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [finalTotal, setFinalTotal] = useState(0);
  const [shippingAmount, setShippingAmount] = useState(null);
  const [discountDetails, setDiscountDetails] = useState({ code: null, amount: 0, });
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appliedCode, setAppliedCode] = useState(null);
  const [input, setInput] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('contactInfo') || '';
    }
    return '';
  });

  const [error, setError] = useState('');

  const validateInput = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    const trimmed = value.trim();

    if (!trimmed) {
      setError("Enter an email or phone number.");
      return false;
    }

    if (emailRegex.test(trimmed) || phoneRegex.test(trimmed)) {
      setError("");
      if (typeof window !== "undefined") {
        localStorage.setItem("contactInfo", trimmed);
      }
      return true;
    } else {
      setError("Please enter a valid email or phone number.");
      return false;
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    validateInput(value);
  };

  const handleInputChange = (field, value) => {
    setDeliveryData(prev => ({
      ...prev,
      [field]: value
    }));

    setErrors(prev => ({
      ...prev,
      [field]: value.trim()
        ? ''
        : `Enter a ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
    }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
    }
  }, [deliveryData]);

  const handleCheckboxChange = (e) => {
    setShowTip(e.target.checked);
  };

  const handleRember = (e) => {
    setRember(e.target.checked);
  };

  const handleNumber = (e) => {
    setNumber(e.target.checked);
  };

  const [productDiscounts, setProductDiscounts] = useState({});
  const discountObjects = discounts.map(d => d?.node?.discount).filter(Boolean);

  const cartProductIds = new Set(
    (cartData?.lines?.edges || []).map(item => {
      const variant = item.node.merchandise;
      const productId = (variant?.product?.id || variant?.id)?.replace("gid://shopify/Product/", "");
      return productId;
    })
  );

  const country = taxCountries.find((c) => c.code === selectedCountry);

  let gstRate = 0;
  let taxName = "";

  if (country) {
    if (country.provinces?.length > 0 && selectedProvince) {
      const province = country.provinces.find((p) => p.code === selectedProvince);
      gstRate = province?.tax ?? country.tax ?? 0;
      taxName = province?.tax_name ?? "";
    } else {
      gstRate = country.tax ?? 0;
      taxName = country.tax_name ?? "";
    }
  }

  const productDiscountAmount = Object.values(productDiscounts || {})
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const totalDiscountAmount =
    (discountDetails?.amount || 0) + productDiscountAmount;

  const subtotal1 = (cartData?.lines?.edges || []).reduce((acc, item) => {
    const line = item?.node;
    const price = parseFloat(line?.merchandise?.price?.amount || 0);
    const quantity = line?.quantity || 1;
    return acc + price * quantity;
  }, 0);

  const totalEstimatedTax = (cartData?.lines?.edges || []).reduce((acc, item) => {
    const line = item?.node;
    const variant = line?.merchandise;
    const price = parseFloat(variant?.price?.amount || 0);
    const quantity = line?.quantity || 1;

    const isTaxable = variant?.taxable ?? true;

    if (isTaxable) {
      const lineTotal = price * quantity;
      const discountShare = subtotal1 > 0
        ? (lineTotal / subtotal1) * (totalDiscountAmount || 0)
        : 0;

      const taxableAmount = Math.max(0, lineTotal - discountShare);
      return acc + taxableAmount * (gstRate || 0);
    }

    return acc;
  }, 0);

  const automaticDiscountMap = new Map();

  if (freeShippingCode?.applied) {
    console.log("⛔ Skipping automatic discounts because free shipping is applied");
  } else {
    discounts.forEach((discountItem) => {
      const discount = discountItem.node.discount;

      if (
        discount.__typename === "DiscountAutomaticBasic" &&
        discount.status === "ACTIVE"
      ) {
        const value = discount?.customerGets?.value;
        const percentage = value?.percentage;
        const fixedAmount = Number(value?.amount?.amount || value?.fixedAmount?.amount || 0);
        const title = discount?.title;

        const productEdges = discount?.customerGets?.items?.products?.edges || [];
        const collectionEdges = discount?.customerGets?.items?.collections?.edges || [];

        const minSubtotal = Number(
          discount?.minimumRequirement?.greaterThanOrEqualToSubtotal?.amount || 0
        );

        if ((percentage || fixedAmount) && collectionEdges.length > 0) {
          const collectionIds = collectionEdges
            .map(edge => edge.node?.id)
            .filter(id => id)
            .map(id => id.replace("gid://shopify/Collection/", ""));

          const cartSubtotal = Math.round((finalTotal + totalEstimatedTax) * 100) / 100;

          if (cartSubtotal < minSubtotal) {
            // console.log(`⛔ Skipping collection-based discount "${title}" — subtotal ₹${cartSubtotal} < ₹${minSubtotal}`);
            return;
          }

          (cartData?.lines?.edges || []).forEach(line => {
            const product = line.node.merchandise.product;
            const productId = product.id.replace("gid://shopify/Product/", "");

            const price = Number(line.node.merchandise.price?.amount || 0);
            const quantity = Number(line.node.quantity || 1);

            const discountAmount = percentage
              ? price * percentage * quantity
              : fixedAmount;

            automaticDiscountMap.set(productId, {
              title,
              type: percentage ? 'percentage' : 'fixed',
              value: percentage || fixedAmount,
              price,
              discountAmount,
              quantity,
              collectionIds,
            });
          });

          return;
        }

        if ((percentage || fixedAmount) && productEdges.length > 0) {
          productEdges.forEach((productEdge) => {
            const cleanedId = productEdge.node?.id.replace("gid://shopify/Product/", "");

            if (cartProductIds.has(cleanedId) && !automaticDiscountMap.has(cleanedId)) {
              const cartLine = cartData.lines.edges.find(line =>
                line.node.merchandise.product.id.includes(cleanedId)
              );

              const price = Number(cartLine?.node?.merchandise?.price?.amount || 0);
              const quantity = Number(cartLine?.node?.quantity || 1);

              const discountAmount = percentage
                ? price * percentage * quantity
                : fixedAmount;

              automaticDiscountMap.set(cleanedId, {
                title,
                type: percentage ? 'percentage' : 'fixed',
                value: percentage || fixedAmount,
                price,
                discountAmount,
                quantity
              });
            }
          });
        }

        if ((percentage || fixedAmount) && collectionEdges.length > 0) {
          const collectionIds = collectionEdges.map(edge =>
            edge.node?.id.replace("gid://shopify/Collection/", "")
          );

          cartData.lines.edges.forEach(line => {
            const product = line.node.merchandise.product;
            const productId = product.id.replace("gid://shopify/Product/", "");

            const alreadyDiscounted = automaticDiscountMap.has(productId);

            if (!alreadyDiscounted) {
              const price = Number(line.node.merchandise.price?.amount || 0);
              const quantity = Number(line.node.quantity || 1);

              const discountAmount = percentage
                ? price * percentage * quantity
                : fixedAmount;


              automaticDiscountMap.set(productId, {
                title,
                type: percentage ? 'percentage' : 'fixed',
                value: percentage || fixedAmount,
                price,
                discountAmount,
                quantity,
                collectionIds,
              });
            } else {
              console.log(`⚠️ Skipping ${productId}: already has a discount`);
            }
          });
        }
      }
    });
  }

  useEffect(() => {
    if (!cartData?.lines?.edges) return;

    const newDiscounts = {};

    cartData.lines.edges.forEach((item) => {
      const line = item.node;
      const variant = line.merchandise;
      const product = variant.product;
      const price = parseFloat(variant.price.amount);
      const quantity = line.quantity;
      const productId = product.id.replace("gid://shopify/Product/", "");

      let discountTitle = null;
      let discountAmount = 0;
      let type = null;

      const matchedCodeDiscount = appliedCode && discountObjects.find(discount =>
        discount.__typename === "DiscountCodeBasic" &&
        discount.codes?.edges?.some(edge => edge.node.code?.toLowerCase() === appliedCode.toLowerCase()) &&
        discount.customerGets?.items?.products?.edges?.some(edge =>
          edge.node.id.replace("gid://shopify/Product/", "") === productId
        )
      );

      if (matchedCodeDiscount) {
        const value = matchedCodeDiscount.customerGets?.value;
        const percentage = value?.percentage;
        const fixedAmount = value?.amount?.amount || value?.fixedAmount?.amount;

        if (percentage) {
          discountAmount = price * quantity * percentage;
          type = 'percentage';
        } else if (fixedAmount) {
          discountAmount = Number(fixedAmount);
          type = 'fixed';
        }

        discountTitle = matchedCodeDiscount.title;
      } else if (!appliedCode && automaticDiscountMap.has(productId)) {
        const autoDiscount = automaticDiscountMap.get(productId);
        discountTitle = autoDiscount.title;
        discountAmount = autoDiscount.discountAmount;
        type = 'auto';
      }

      if (discountAmount > 0) {
        newDiscounts[productId] = {
          title: discountTitle,
          amount: discountAmount,
          type,
        };
      }
    });

    const isDifferent = JSON.stringify(productDiscounts) !== JSON.stringify(newDiscounts);

    if (isDifferent) {
      setProductDiscounts(newDiscounts);
    }

  }, [cartData, appliedCode, discountObjects, automaticDiscountMap]);

  const handleApply = (e) => {
    e.preventDefault();

    const cartSubtotal = Math.round((finalTotal + totalEstimatedTax) * 100) / 100;
    console.log("Cart Subtotal:", cartSubtotal);

    const input = code.trim();

    if (!input) {
      setSuccess(false);
      setMessage("❌ Please enter a discount code.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setLoading(true);
    const lowerInput = input.toLowerCase();

    const cartProductIds = new Set(
      cartData.lines.edges.map(item =>
        item.node.merchandise.product.id.replace("gid://shopify/Product/", "")
      )
    );

    const match = discountObjects.find(discount => {
      const isBasic = discount.__typename === "DiscountCodeBasic";
      const isFreeShipping = discount.__typename === "DiscountCodeFreeShipping";

      if (!isBasic && !isFreeShipping) return false;
      if (discount.status !== "ACTIVE") return false;

      const hasMatchingCode = discount?.codes?.edges?.some(edge =>
        edge?.node?.code?.toLowerCase() === lowerInput
      );
      if (!hasMatchingCode) return false;

      if (isFreeShipping) {
        const minSubtotal = parseFloat(
          discount?.minimumRequirement?.greaterThanOrEqualToSubtotal?.amount || 0
        );
        const minQuantity = parseInt(
          discount?.minimumRequirement?.greaterThanOrEqualToQuantity || 0
        );

        const totalQuantity = cartData?.lines?.edges?.reduce((sum, item) => {
          return sum + (item?.node?.quantity || 0);
        }, 0);

        if (minSubtotal > 0 && cartSubtotal < minSubtotal) {
          console.log(`❌ Cart subtotal ${cartSubtotal} is less than required ${minSubtotal}`);
          return false;
        }

        if (minQuantity > 0 && totalQuantity < minQuantity) {
          console.log(`❌ Cart quantity ${totalQuantity} is less than required ${minQuantity}`);
          return false;
        }

        return true;
      }

      const productEdges = discount?.customerGets?.items?.products?.edges || [];
      return (
        productEdges.length === 0 ||
        productEdges.some(edge => {
          const productId = edge?.node?.id.replace("gid://shopify/Product/", "");
          return cartProductIds.has(productId);
        })
      );
    });

    setTimeout(() => {
      if (match) {
        setAppliedCode(null);
        localStorage.removeItem("appliedDiscountCode");
        setFreeShippingCode(null);
        localStorage.removeItem("appliedFreeShippingCode");

        const matchedCodeEdge = match.codes.edges.find(
          edge => edge?.node?.code?.toLowerCase() === lowerInput
        );
        const appliedCodeValue = matchedCodeEdge?.node?.code || match.title;

        setSuccess(true);

        if (match.__typename === "DiscountCodeBasic") {
          setAppliedCode(appliedCodeValue);
          localStorage.setItem("appliedDiscountCode", appliedCodeValue);
        }

        if (match.__typename === "DiscountCodeFreeShipping") {
          const minSubtotal = parseFloat(
            match?.minimumRequirement?.greaterThanOrEqualToSubtotal?.amount || 0
          );
          const minQuantity = parseInt(
            match?.minimumRequirement?.greaterThanOrEqualToQuantity || 0
          );
          const freeShippingObj = {
            code: appliedCodeValue,
            minSubtotal,
            minQuantity,
            applied: true,
          };
          setFreeShippingCode(freeShippingObj);
          localStorage.setItem("appliedFreeShippingCode", JSON.stringify(freeShippingObj));
        }

        setCode("");
        setMessage("");
      } else {
        setSuccess(false);
        setMessage("Enter a valid discount code");
        setCode("");
      }
      setLoading(false);
    }, 3000);
  };

  useEffect(() => {
    const cartSubtotal = Math.round((finalTotal + totalEstimatedTax) * 100) / 100;

    if (freeShippingCode?.applied) {
      const minSubtotal = freeShippingCode?.minSubtotal || 0;

      if (cartSubtotal < minSubtotal) {
        console.log(`❌ Removing Free Shipping — subtotal ${cartSubtotal} < required ${minSubtotal}`);
        setFreeShippingCode(null);
        localStorage.removeItem("appliedFreeShippingCode");
      }
    }
  }, [finalTotal, totalEstimatedTax, freeShippingCode]);

  useEffect(() => {
    const storedBasic = localStorage.getItem("appliedDiscountCode");
    const storedFreeShipping = localStorage.getItem("appliedFreeShippingCode");

    if (storedBasic) {
      setAppliedCode(storedBasic);
      setSuccess(true);
    }
    if (storedFreeShipping) {
      try {
        setFreeShippingCode(JSON.parse(storedFreeShipping));
      } catch {
        console.warn("Failed to parse stored free shipping code");
      }
    }
  }, []);

  const handleRemove = () => {
    setAppliedCode(null);
    localStorage.removeItem("appliedDiscountCode");
    setSuccess(false);
    setTimeout(() => setMessage(""), 2000);
  };

  useEffect(() => {
    if (storefrontToken) {
      localStorage.setItem("storefrontToken", storefrontToken);
    }
  }, [storefrontToken]);

  const handleRemoveFreeShipping = () => {
    setFreeShippingCode(null);
    localStorage.removeItem("appliedFreeShippingCode");
  };

  const handleCountryChange = async (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);

    console.log(selected)

    setPin("");
    setSelectedProvince("");
    setDeliveryData(prev => ({
      ...prev,
      address: "",
      city: "",
      firstName: "",
      lastName: "",
      apartment: "",
      phone: ""
    }));
    setAddressSuggestions([]);
    setAddressQuery("");

    setShowSpinnerLineId("country-update");
    setSpinnerActionType("update");

    const countryInfo = countries[selected]
    const updatedCurrency = countryInfo?.currencies?.[0] || "";

    const url = new URL(window.location.href);
    const cartToken = url.searchParams.get("cart_token");
    let cartId = cartToken || localStorage.getItem("cart_token");
    if (cartId && !cartId.startsWith("gid://shopify/Cart/")) {
      cartId = `gid://shopify/Cart/${cartId}`;
    }

    if (!cartId) {
      console.warn("⚠️ cart_id is missing. Check URL or localStorage.");

      setShowSpinnerLineId(null);
      setSpinnerActionType(null);
      return;
    }

    const lineId = cartData?.lines?.edges?.[0]?.node?.id || null;

    try {
      const response = await fetch(`${apiBaseUrl}/update-country`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: cartId,
          currency: updatedCurrency,
          countryCode: selected,
          line_id: lineId,
          shop,
          accessToken,
          storefrontToken
        }),
      });

      const data = await response.json();
      refreshCart();
      console.log("✅ Backend response:", data);

      if (data.success && updatedCurrency) {
        localStorage.setItem("currency", updatedCurrency);
        setCurrency(updatedCurrency);
      }
    } catch (err) {
      console.error("❌ Error updating country:", err);
    } finally {

      setShowSpinnerLineId(null);
      setSpinnerActionType(null);
    }
  };

  let subtotal = 0;

  cartData?.lines?.edges?.forEach((item) => {
    const product = item?.node?.merchandise?.product;
    const variant = item?.node?.merchandise;
    const quantity = item?.node?.quantity;

    const price = parseFloat(variant?.price?.amount || 0);
    const productId = product.id.replace("gid://shopify/Product/", "");

    const codeDiscount = discountObjects.find(discount =>
      discount.__typename === "DiscountCodeBasic" &&
      discount.codes?.edges?.some(edge =>
        edge.node.code.toLowerCase() === appliedCode?.toLowerCase()
      ) &&
      discount.customerGets?.items?.products?.edges?.some(edge =>
        edge.node.id.replace("gid://shopify/Product/", "") === productId
      )
    );

    const autoDiscount = automaticDiscountMap.get(productId);

    let discountAmount = 0;

    if (codeDiscount) {
      const value = codeDiscount.customerGets?.value;
      if (value?.percentage) {

        discountAmount = price * value.percentage * quantity;
      } else if (value?.amount?.amount) {

        discountAmount = parseFloat(value.amount.amount);
      }
    } else if (!appliedCode && autoDiscount) {
      if (autoDiscount.type === "percentage") {
        discountAmount = price * autoDiscount.value * quantity;
      } else if (autoDiscount.type === "fixed") {
        discountAmount = autoDiscount.value;
      }
    }

    const totalPrice = price * quantity;
    let finalPrice = totalPrice - discountAmount;

    if (finalPrice < 0) finalPrice = 0;

    subtotal += finalPrice;
  });

  let discountAmount = 0;
  let codeDiscountApplied = false;

  cartData?.lines?.edges?.forEach((item) => {
    const product = item?.node?.merchandise?.product;
    const variant = item?.node?.merchandise;
    const quantity = item?.node?.quantity || 1;

    const price = parseFloat(variant?.price?.amount || 0);
    const productId = product?.id?.replace("gid://shopify/Product/", "");

    const codeDiscount = discountObjects.find(discount =>
      discount.__typename === "DiscountCodeBasic" &&
      discount.codes?.edges?.some(edge =>
        edge.node.code.toLowerCase() === appliedCode?.toLowerCase()
      ) &&
      (
        !discount.customerGets?.items?.products?.edges?.length ||
        discount.customerGets?.items?.products?.edges?.some(edge =>
          edge.node.id.replace("gid://shopify/Product/", "") === productId
        )
      )
    );

    const autoDiscount = automaticDiscountMap.get(productId);

    if (codeDiscount && !codeDiscountApplied) {
      const value = codeDiscount.customerGets?.value;

      if (value?.percentage) {
        discountAmount += price * value.percentage * quantity;
      } else if (value?.amount?.amount) {
        discountAmount += parseFloat(value.amount.amount);
        codeDiscountApplied = true;
      }
    } else if (!appliedCode && autoDiscount) {
      if (autoDiscount.type === "percentage") {
        discountAmount += price * autoDiscount.value * quantity;
      } else if (autoDiscount.type === "fixed") {
        discountAmount += autoDiscount.value;
      } else if (autoDiscount.discountAmount) {
        discountAmount += autoDiscount.discountAmount;
      }
    }
  });

  const normalizeId = (id) => id?.split("/").pop();
  const hasCodeDiscountInCart = cartData?.lines?.edges?.some((item) => {
    const productId = normalizeId(item?.node?.merchandise?.product?.id);

    return discountObjects.some(discount =>
      discount.__typename === "DiscountCodeBasic" &&
      discount.codes?.edges?.some(edge =>
        edge.node.code.toLowerCase() === appliedCode?.toLowerCase()
      ) &&
      discount.customerGets?.items?.products?.edges?.some(edge =>
        normalizeId(edge.node.id) === productId
      )
    );
  });

  useEffect(() => {
    if (!hasCodeDiscountInCart && appliedCode) {
      setDiscountDetails({
        code: appliedCode,
        amount: discountAmount,
      });
    } else {
      setDiscountDetails({
        code: null,
        amount: 0,
      });
    }
  }, [appliedCode, discountAmount, hasCodeDiscountInCart]);

  const roundToTwo = (num) => parseFloat(num.toFixed(2));

  useEffect(() => {
    if (!selectedShipping || !currency) return;

    const fetchRatesAndConvert = async () => {
      try {
        const shipping = selectedShipping?.price ? parseFloat(selectedShipping.price) : null;
        if (shipping === null) {
          setShippingAmount(null);
          return;
        }

        const response = await axios.get("https://api.unirateapi.com/api/rates", {
          params: {
            api_key: "fd4zbA40dtNfpRzWnNg2hK3f4r0dBWEDOe3OfW1skaU2GBCOxltg0Q0KlwknSnfm",
            from: "INR",
          },
        });

        const rates = response.data?.rates || {};
        const rate = rates[currency] || 1;
        let converted = shipping * rate;

        const hasProductDiscount = productDiscounts && Object.keys(productDiscounts).length > 0;

        if (appliedCode || hasProductDiscount) {
          setShippingAmount(roundToTwo(converted));
          return;
        }

        const totalQuantity = cartData?.lines?.edges?.reduce((sum, item) => {
          return sum + (item?.node?.quantity || 0);
        }, 0);

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

            const meetsSubtotal = subtotalReq > 0
              ? (finalTotal + totalEstimatedTax) >= subtotalReq
              : true;

            const meetsQuantity = quantityReq > 0
              ? totalQuantity >= quantityReq
              : true;

            return meetsSubtotal && meetsQuantity;
          });

        if (hasFreeShipping) {
          console.log("✅ Free shipping applied!");
          converted = 0;
        } else {
          console.log("❌ No free shipping applied — subtotal:", finalTotal + totalEstimatedTax, "quantity:", totalQuantity);
        }

        const rounded = roundToTwo(converted);
        setShippingAmount(rounded);

      } catch (error) {
        console.error("Error fetching currency rates:", error);
      }
    };

    fetchRatesAndConvert();
  }, [selectedShipping, currency, finalTotal, totalEstimatedTax, discounts, appliedCode,
    productDiscounts, freeShippingCode, cartData
  ]);

  useEffect(() => {
    const discountApplied = !hasCodeDiscountInCart && appliedCode;
    const shippingPrice = shippingAmount ?? 0;
    const base = discountApplied ? subtotal - discountAmount : subtotal;

    const total = base + shippingPrice;
    setFinalTotal(total);
  }, [
    subtotal,
    discountAmount,
    appliedCode,
    hasCodeDiscountInCart,
    shippingAmount
  ]);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
  });

  const validateFields = () => {
    const newErrors = {};
    let hasError = false;

    if (!deliveryData.lastName.trim()) {
      newErrors.lastName = "Enter a last name";
      hasError = true;
    }

    if (!deliveryData.address.trim()) {
      newErrors.address = "Enter an address";
      hasError = true;
    }

    if (!deliveryData.city.trim()) {
      newErrors.city = "Enter a city";
      hasError = true;
    }

    let provinceErrorLocal = "";
    if (!selectedProvince || selectedProvince === "") {
      provinceErrorLocal = "Please select a state";
      hasError = true;
    }

    let pinErrorLocal = "";
    if (!pin || pin.trim() === "") {
      pinErrorLocal = "Enter a PIN code";
      hasError = true;
    } else if (!/^\d{6}$/.test(pin)) {
      pinErrorLocal = "Enter a valid 6-digit PIN code";
      hasError = true;
    }

    setErrors(newErrors);
    setProvinceError(provinceErrorLocal);
    setPinFormatError(pinErrorLocal);

    return !hasError;
  };

  const [cardErrors, setCardErrors] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });

  const [complete, setComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });

  const isStripeInputValid = () => {
    const errors = {};

    if (!complete.number) errors.number = "Enter a card number";
    if (!complete.expiry) errors.expiry = "Enter a valid expiration date";
    if (!complete.cvc) errors.cvc = "Enter the CVV or security code on your card";

    setCardErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const sectionComponents = {
    review: (
      <ReviewText reviewInputs={reviewInputs} />
    ),
    product: (
      <ReviewProduct
        products={products}
        refreshCart={refreshCart}
        getCurrencySymbol={getCurrencySymbol}
        currency={currency}
        selectedProducts={selectedProducts}
        productStyle={productStyle}
        gridItemsPerRow={gridItemsPerRow}
        shop={shop}
        accessToken={accessToken}
        productHeading={productHeading}
        storefrontToken={storefrontToken}
      />
    ),
    video: (
      <ReviewVideo
        videoInputs={videoInputs}
      />
    ),
    urgencyBar: (
      <UrgencyBar
        selectedbar={selectedbar}
        setSelectedBar={setSelectedBar}
      />
    ),
    trustBages: (
      <TrustBages
        setSelectedbages={setSelectedbages}
        selectedbages={selectedbages}
        setBagesStyle={setBagesStyle}
        setGridPerSlide={setGridPerSlide}
        gridPerSlide={gridPerSlide}
        bagesStyle={bagesStyle}
      />
    ),
    richtext: (
      <RichText
        richInputs={richInputs}
      />
    ),
  };

  useEffect(() => {
    if (selectedOption) {
      localStorage.setItem("selectedOption", selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (!shop) return;

    const fetchCurrentOption = async () => {
      try {
        const [resCheckoutV2, resCustomData] = await Promise.all([
          fetch(`${apiBaseUrl}/checkoutV2/option?shop=${shop}`),
          fetch(`${apiBaseUrl}/custom-data/option?shop=${shop}`),
        ]);

        const dataCheckoutV2 = await resCheckoutV2.json().catch(() => null);
        const dataCustomData = await resCustomData.json().catch(() => null);

        let option = null;
        if (dataCheckoutV2?.data?.checkout_option === "pro") {
          option = "pro";
        } else if (dataCustomData?.data?.checkout_option === "basic") {
          option = "basic";
        }

        if (option && option !== selectedOption) {
          setSelectedOption(option);
          localStorage.setItem("selectedOption", option);
        }
        console.log("Selected checkout option:", option);
      } catch (err) {
        console.error("Error fetching checkout option:", err);
      }
    };

    fetchCurrentOption();
  }, [shop, selectedOption]);

  useEffect(() => {
    if (!shop) return;

    const fetchData = async () => {
      try {
        let url;
        if (activeTab === "thankyou") {
          url = `${apiBaseUrl}/thanku-data?shop=${encodeURIComponent(shop)}`;
        } else if (selectedOption === "pro") {
          url = `${apiBaseUrl}/checkoutV2-data?shop=${encodeURIComponent(shop)}`;
        } else if (selectedOption === "basic") {
          url = `${apiBaseUrl}/custom-data?shop=${encodeURIComponent(shop)}`;
        } else {
          console.log("⚠️ No selectedOption, skipping fetch");
          return;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        console.log("Fetched custom data:", data);

        if (!data.checkout_option && activeTab !== "thankyou") {
          console.log("⚠️ checkout_option is null → Not setting data");
          return;
        }

        setCustomData(data);
        setSelectedSections(data.options || []);

        if (data.products?.length) {
          const dataProductIds = data.products.map(id => id.split("/").pop());
          const fullProducts = products.filter(p =>
            dataProductIds.includes(p.id.split("/").pop())
          );
          setSelectedProducts(fullProducts);
        } else {
          setSelectedProducts([]);
        }

        setLogo(data.logo || "");
        setSideLogo(data.sidelogo || "");
        setCheckOutBtnBgColor(data.checkOutBtnBgColor || "");

        const fetchedPaymentOptions = Array.isArray(data.CheckoutPaymentOtions)
          ? data.CheckoutPaymentOtions
          : data.CheckoutPaymentOtions
            ? JSON.parse(data.CheckoutPaymentOtions)
            : [];
        setCheckoutPaymentOtions(fetchedPaymentOptions);

        let storefrontTokenValue = data.storefrontToken;
        let stripePublishableKeyValue = data.stripePublishableKey;
        let stripeSecretKeyValue = data.stripeSecretKey;
        let razorpayIDValue = data.razorpayID;
        let razorpayKeyValue = data.razorpayKey;

        if (
          !storefrontTokenValue || !stripePublishableKeyValue || !stripeSecretKeyValue
          || !razorpayIDValue || !razorpayKeyValue
        ) {
          const fallbackUrls = [
            `${apiBaseUrl}/checkoutV2-data?shop=${encodeURIComponent(shop)}`,
            `${apiBaseUrl}/custom-data?shop=${encodeURIComponent(shop)}`,
            `${apiBaseUrl}/thanku-data?shop=${encodeURIComponent(shop)}`
          ];

          for (const fallbackUrl of fallbackUrls) {
            if (fallbackUrl === url) continue;

            try {
              const res2 = await fetch(fallbackUrl);
              if (!res2.ok) continue;

              const fallbackData = await res2.json();

              if (!storefrontTokenValue && fallbackData.storefrontToken) {
                storefrontTokenValue = fallbackData.storefrontToken;
              }

              if (!stripePublishableKeyValue && fallbackData.stripePublishableKey) {
                stripePublishableKeyValue = fallbackData.stripePublishableKey;
              }

              if (!stripeSecretKeyValue && fallbackData.stripeSecretKey) {
                stripeSecretKeyValue = fallbackData.stripeSecretKey;
              }

              if (!razorpayIDValue && fallbackData.razorpayID) {
                razorpayIDValue = fallbackData.razorpayID;
              }

              if (!razorpayKeyValue && fallbackData.razorpayKey) {
                razorpayKeyValue = fallbackData.razorpayKey;
              }

              if (
                storefrontTokenValue && stripePublishableKeyValue && stripeSecretKeyValue
                && razorpayIDValue && razorpayKeyValue
              ) {
                break;
              }
            } catch (err) {
              console.warn("⚠️ Fallback fetch failed:", fallbackUrl, err);
            }
          }
        }

        if (storefrontTokenValue) setStorefrontToken(storefrontTokenValue);
        if (stripePublishableKeyValue) setStripePublishableKey(stripePublishableKeyValue);
        if (stripeSecretKeyValue) setStripeSecretKey(stripeSecretKeyValue);
        if (razorpayIDValue) setRazorpayID(razorpayIDValue);
        if (razorpayKeyValue) setRazorpayKey(razorpayKeyValue);

        setReviewInputs(data.reviews || []);
        setBgColor(data.bgColor || "#fff");
        setBgImage(data.bgImage || "");
        setContactOptions(data.contactOptions || "");

        if (data.styles) {
          const styleObj = Array.isArray(data.styles) ? data.styles[0] : data.styles;
          if (styleObj) {
            setProductStyle(styleObj.productStyle || "slider");
            setBagesStyle(styleObj.bagesStyle || "slider");
            setGridPerSlide(styleObj.gridPerSlide || 1);
            setGridItemsPerRow(styleObj.gridItemsPerRow || 2);
            setProductHeading(styleObj.productHeading || "");

            if (typeof styleObj.hideLogo !== "undefined") setHideLogo(styleObj.hideLogo);
            if (typeof styleObj.hideSideLogo !== "undefined") setSideHideLogo(styleObj.hideSideLogo);

            if (typeof styleObj.sideBarSection !== "undefined") {
              setSideBarSection(styleObj.sideBarSection);
            }
          }
        }

        const videoList = Array.isArray(data.videos?.list) ? data.videos.list : [];
        const displayType = data.videos?.display || "slider";
        const headingText = data.videos?.heading || "";

        setVideoInputs({
          videos: videoList.filter(v => !["grid", "slider"].includes(v)),
          display: displayType,
          itemsPerRow: data.styles?.itemsPerRow || 2,
          heading: headingText
        });

        if (data.urgencyBar) {
          setSelectedBar(data.urgencyBar);
        }
        setRichInputs(Array.isArray(data.richText) ? data.richText : data.richText ? [data.richText] : []);
        setSelectedbages(
          Array.isArray(data.trustBages)
            ? data.trustBages
            : data.trustBages
              ? [data.trustBages] : []);

        const defaultPositions = ["product", "review", "video", "urgencyBar", "trustBages", "richtext"];
        const fetchedPositions = data.sectionPositions || {};
        const mergedPositions = {};
        defaultPositions.forEach(section => {
          mergedPositions[section] = fetchedPositions[section] || "last";
        });
        setSectionPositions(mergedPositions);

      } catch (err) {
        console.error("Error fetching custom data:", err);
      }
    };

    fetchData();
  }, [shop, selectedOption, activeTab]);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    const duration = hasVisited ? 3000 : 4000;
    const timer = setTimeout(() => {

      setShowSkeleton(false);
    }, duration);

    sessionStorage.setItem("hasVisited", "true");

    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton || !customData) {
    return <SkeletonPage />;
  }

  return (
    <div
      className="custom-checkout"
      style={{
        backgroundColor: bgColor,
        backgroundImage: `url('${apiBaseUrl}/${bgImage}')`,
      }}>

      <div className="container-checkout">
        {!isCheckoutPage && (
          <Bar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setActiveSetting={setActiveSetting}
            setSaveData={setSaveData}
            saveData={saveData}
          />)}
        <div className="checkout-warp-cont no-sidebar input-wrapp">
          <div className='checkout-warp-cont-side-bar' style={{ display: isCheckoutPage ? "none" : "block" }}>
            <Sidebar
              sections={sections}
              accessToken={accessToken}
              selectedSections={selectedSections}
              setSelectedSections={setSelectedSections}
              shop={shop}
              products={products}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              setSelectedBar={setSelectedBar}
              selectedbar={selectedbar}
              setReviewInputs={setReviewInputs}
              reviewInputs={reviewInputs}
              productStyle={productStyle}
              setProductStyle={setProductStyle}
              setGridItemsPerRow={setGridItemsPerRow}
              setVideoInputs={setVideoInputs}
              videoInputs={videoInputs}
              gridItemsPerRow={gridItemsPerRow}
              setSelectedbages={setSelectedbages}
              selectedbages={selectedbages}
              setBagesStyle={setBagesStyle}
              setGridPerSlide={setGridPerSlide}
              gridPerSlide={gridPerSlide}
              bagesStyle={bagesStyle}
              sectionPositions={sectionPositions}
              setSectionPositions={setSectionPositions}
              setActiveSetting={setActiveSetting}
              setActiveTab={setActiveTab}
              activeSetting={activeSetting}
              activeTab={activeTab}
              saveData={saveData}
              setSaveData={setSaveData}
              stripePublishableKey={stripePublishableKey}
              setStripePublishableKey={setStripePublishableKey}
              stripeSecretKey={stripeSecretKey}
              setStripeSecretKey={setStripeSecretKey}
              razorpayID={razorpayID}
              setRazorpayID={setRazorpayID}
              setRazorpayKey={setRazorpayKey}
              setStorefrontToken={setStorefrontToken}
              storefrontToken={storefrontToken}
              razorpayKey={razorpayKey}
              setLogo={setLogo}
              setHideLogo={setHideLogo}
              hideLogo={hideLogo}
              logo={logo}
              setSideHideLogo={setSideHideLogo}
              hideSideLogo={hideSideLogo}
              setSideLogo={setSideLogo}
              sidelogo={sidelogo}
              setBgColor={setBgColor}
              bgColor={bgColor}
              setBgImage={setBgImage}
              bgImage={bgImage}
              sectionsWithImagesWhite={sectionsWithImagesWhite}
              sectionsWithImagesBlack={sectionsWithImagesBlack}
              productHeading={productHeading}
              setProductHeading={setProductHeading}
              setRichInputs={setRichInputs}
              richInputs={richInputs}
              checkOutBtnBgColor={checkOutBtnBgColor}
              setCheckOutBtnBgColor={setCheckOutBtnBgColor}
              setCheckoutPaymentOtions={setCheckoutPaymentOtions}
              CheckoutPaymentOtions={CheckoutPaymentOtions}
              paymentOptions={paymentOptions}
              contactOptions={contactOptions}
              setContactOptions={setContactOptions}
              setHiddenSections={setHiddenSections}
              hiddenSections={hiddenSections}
              sideBarSection={sideBarSection}
              selectedOption={selectedOption}
              setSideBarSection={setSideBarSection}
              setShowProductPopup={setShowProductPopup}
              showProductPopup={showProductPopup}
            />
          </div>
          <div
            className={`checkout-page-banner ${!isCheckoutPage ? "custom-width" : ""}`}
            style={{
              width: isCheckoutPage ? "100%" : "82%",
              transition: "width 0.3s",
            }}>
            <Banner
              setLogo={setLogo}
              logo={logo}
              setHideLogo={setHideLogo}
              hideLogo={hideLogo}
              setSideHideLogo={setSideHideLogo}
              hideSideLogo={hideSideLogo}
              setSideLogo={setSideLogo}
              sidelogo={sidelogo}
            />
            <div className='checkout-page-banner-wrapp checkout-v1'>
              <div className='checkout-warp-cont-left-side'>
                <div className="checkout-warp ">
                  {showThankyouPage ? (
                    <>
                      <Thankyou
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        thankuu={thankuu}
                        setShowThankyouPage={setShowThankyouPage}
                        showThankyouPage={showThankyouPage}
                        refreshCart={refreshCart}
                        getCurrencySymbol={getCurrencySymbol}
                        currency={currency}
                        selectedProducts={selectedProducts}
                        productStyle={productStyle}
                        gridItemsPerRow={gridItemsPerRow}
                        ReviewText={ReviewText}
                        reviewInputs={reviewInputs}
                        products={products}
                        videoInputs={videoInputs}
                        selectedbar={selectedbar}
                        setSelectedBar={setSelectedBar}
                        setSelectedbages={setSelectedbages}
                        selectedbages={selectedbages}
                        setBagesStyle={setBagesStyle}
                        setGridPerSlide={setGridPerSlide}
                        gridPerSlide={gridPerSlide}
                        bagesStyle={bagesStyle}
                        sectionPositions={sectionPositions}
                        selectedSections={selectedSections}
                        shop={shop}
                        storefrontToken={storefrontToken}
                        accessToken={accessToken}
                      />
                    </>
                  ) : (
                    <>

                      {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                        (section) =>
                          selectedSections.includes(section) &&
                          sectionPositions[section] === "aboveContent" && (
                            <React.Fragment key={section}>
                              {sectionComponents[section]}
                            </React.Fragment>
                          )
                      )}
                      <Contact
                        gapy={gapy}
                        pay={pay}
                        handleChange={handleChange}
                        input={input}
                        error={error}
                        shop={shop}
                        contactOptions={contactOptions}
                      />
                      {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                        (section) =>
                          selectedSections.includes(section) &&
                          sectionPositions[section] === "aboveDelivery" && (
                            <React.Fragment key={section}>
                              {sectionComponents[section]}
                            </React.Fragment>
                          )
                      )}
                      <Delivery
                        AllowedCountries={AllowedCountries}
                        handleNumber={handleNumber}
                        showNumber={showNumber}
                        setNumber={setNumber}
                        shipping={shipping}
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        selectedProvince={selectedProvince}
                        setSelectedProvince={setSelectedProvince}
                        pin={pin}
                        setPin={setPin}
                        deliveryData={deliveryData}
                        handleInputChange={handleInputChange}
                        errors={errors}
                        pinError={pinError}
                        setPinError={setPinError}
                        provinceError={provinceError}
                        setProvinceError={setProvinceError}
                        pinFormatError={pinFormatError}
                        setPinFormatError={setPinFormatError}
                        pinProvinceError={pinProvinceError}
                        setPinProvinceError={setPinProvinceError}
                        handleCountryChange={handleCountryChange}
                        cartData={cartData}
                        addressSuggestions={addressSuggestions}
                        setAddressSuggestions={setAddressSuggestions}
                        setAddressQuery={setAddressQuery}
                        addressQuery={addressQuery}
                        searchicon={searchicon}
                      />

                      {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                        (section) =>
                          selectedSections.includes(section) &&
                          sectionPositions[section] === "aboveShipping" && (
                            <React.Fragment key={section}>
                              {sectionComponents[section]}
                            </React.Fragment>
                          )
                      )}

                      <Shipping
                        selectedShipping={selectedShipping}
                        setSelectedShipping={setSelectedShipping}
                        shipping={shipping}
                        pin={pin}
                        selectedProvince={selectedProvince}
                        selectedCountry={selectedCountry}
                        getCurrencySymbol={getCurrencySymbol}
                        currency={currency}
                        discounts={discounts}
                        finalTotal={finalTotal}
                        totalEstimatedTax={totalEstimatedTax}
                        productDiscounts={productDiscounts}
                        appliedCode={appliedCode}
                        freeShippingCode={freeShippingCode}
                        cartData={cartData}
                      />

                      {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                        (section) =>
                          selectedSections.includes(section) &&
                          sectionPositions[section] === "underShipping" && (
                            <React.Fragment key={section}>
                              {sectionComponents[section]}
                            </React.Fragment>
                          )
                      )}

                      <Buy
                        cartData={cartData}
                        selectedShipping={selectedShipping}
                        selectedCountry={selectedCountry}
                        pin={pin}
                        deliveryData={deliveryData}
                        getCurrencySymbol={getCurrencySymbol}
                        discountDetails={discountDetails}
                        shippingAmount={shippingAmount}
                        finalTotal={finalTotal}
                        input={input}
                        shipping={shipping}
                        selectedProvince={selectedProvince}
                        productDiscounts={productDiscounts}
                        validateFields={validateFields}
                        pinError={pinError}
                        setPinError={setPinError}
                        provinceError={provinceError}
                        setProvinceError={setProvinceError}
                        validateInput={validateInput}
                        taxCountries={taxCountries}
                        currency={currency}
                        selectedPayment={selectedPayment}
                        paymentOptions={paymentOptions}
                        stripePaymentMethod={stripePaymentMethod}
                        setSelectedPayment={setSelectedPayment}
                        card1={card1}
                        card2={card2}
                        card3={card3}
                        card4={card4}
                        card6={card6}
                        card10={card10}
                        card5={card5}
                        card7={card7}
                        shopImage={shopImage}
                        klarna1={klarna1}
                        Afterpay1={Afterpay1}
                        useShippingAsBilling={useShippingAsBilling}
                        setUseShippingAsBilling={setUseShippingAsBilling}
                        AllowedCountries={AllowedCountries}
                        billing={billing}
                        box={box}
                        selectedbilling={selectedbilling}
                        showTip={showTip}
                        handleCheckboxChange={handleCheckboxChange}
                        showRember={showRember}
                        handleRember={handleRember}
                        setSelectedBilling={setSelectedBilling}
                        setStripePaymentMethod={setStripePaymentMethod}
                        setShowThankyouPage={setShowThankyouPage}
                        showThankyouPage={showThankyouPage}
                        billingAddress={billingAddress}
                        handleChangeBilling={handleChangeBilling}
                        cardErrors={cardErrors}
                        isStripeInputValid={isStripeInputValid}
                        setComplete={setComplete}
                        complete={complete}
                        totalEstimatedTax={totalEstimatedTax}
                        stripePublishableKey={stripePublishableKey}
                        shop={shop}
                        setCardErrors={setCardErrors}
                        stripeSecretKey={stripeSecretKey}
                        razorpayID={razorpayID}
                        razorpayKey={razorpayKey}
                        setUpiId={setUpiId}
                        upiId={upiId}
                        accessToken={accessToken}
                        storefrontToken={storefrontToken}
                        checkOutBtnBgColor={checkOutBtnBgColor}
                        CheckoutPaymentOtions={CheckoutPaymentOtions}
                      />

                      {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                        (section) => {
                          return selectedSections.includes(section) &&
                            sectionPositions[section] === "underPaynow" ? (
                            <React.Fragment key={section}>
                              {sectionComponents[section]}
                            </React.Fragment>
                          ) : null;
                        }
                      )}

                    </>
                  )}
                </div>
              </div>

              <div className='checkout-page-right-side'>
                <div className='checkout-page-customer'>
                  <div className="checkout-page-order-summary-sections">
                    <div className="checkout-page-order-summary-wapped">
                      <OrderSummary
                        toggleProducts={toggleProducts}
                        showProducts={showProducts}
                        getCurrencySymbol={getCurrencySymbol}
                        finalTotal={finalTotal}
                        totalEstimatedTax={totalEstimatedTax}
                        currency={currency}
                      />
                      <div className={`order-summary-prodcut-sections-wrapper ${showProducts ? "open" : ""}`} >
                        <div className="order-summary-prodcut-sections">
                          {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                            (section) =>
                              selectedSections.includes(section) &&
                              sectionPositions[section] === "aboveProduct" && (
                                <React.Fragment key={section}>
                                  {sectionComponents[section]}
                                </React.Fragment>
                              )
                          )}
                          <Product
                            cartData={cartData}
                            selectedShipping={selectedShipping}
                            discounts={discounts}
                            crossbtn={crossbtn}
                            selectedCountry={selectedCountry}
                            shipping={shipping}
                            automaticDiscountMap={automaticDiscountMap}
                            showSpinnerLineId={showSpinnerLineId}
                            appliedCode={appliedCode}
                            getCurrencySymbol={getCurrencySymbol}
                            currency={currency}
                            discountObjects={discountObjects}
                            code={code}
                            handleApply={handleApply}
                            loading={loading}
                            message={message}
                            success={success}
                            subtotal={subtotal}
                            hasCodeDiscountInCart={hasCodeDiscountInCart}
                            setCode={setCode}
                            handleRemove={handleRemove}
                            handleRemoveFreeShipping={handleRemoveFreeShipping}
                            discountAmount={discountAmount}
                            discountDetails={discountDetails}
                            shippingAmount={shippingAmount}
                            finalTotal={finalTotal}
                            spinnerActionType={spinnerActionType}
                            productDiscounts={productDiscounts}
                            setProductDiscounts={setProductDiscounts}
                            products={products}
                            pin={pin}
                            taxCountries={taxCountries}
                            selectedProvince={selectedProvince}
                            totalEstimatedTax={totalEstimatedTax}
                            discount={discount}
                            freeShippingCode={freeShippingCode}
                            updateQuantity={updateQuantity}
                            removeItem={removeItem}
                            discount1={discount1}
                            deletebtn={deletebtn}
                            plus={plus}
                            minus={minus}
                            discross={discross}
                            checkOutBtnBgColor={checkOutBtnBgColor}
                          />
                          {selectedSections.map(
                            (section) =>
                              sectionPositions[section] === "totalPrice" && (
                                <React.Fragment key={section}>
                                  {sectionComponents[section]}
                                </React.Fragment>
                              )
                          )}
                          <div className="selectedSections-mobile">
                            {selectedSections.map(
                              (section) =>
                                sectionPositions[section] === "last" && (
                                  <React.Fragment key={section}>
                                    {sectionComponents[section]}
                                  </React.Fragment>
                                )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`checkout-mobile-sections ${selectedSections.some(
                (section) => sectionPositions[section] === "last"
              )
                ? "has-section"
                : ""
                }`}>
                {selectedSections.map(
                  (section) =>
                    sectionPositions[section] === "last" && (
                      <React.Fragment key={section}>
                        {sectionComponents[section]}
                      </React.Fragment>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 