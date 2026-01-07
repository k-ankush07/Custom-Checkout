import React from "react";
import axios from "axios";
import AllowedCountries from "../checkout-V1/Countries";
import { useState, useEffect, useRef } from "react";
import { countries } from "country-data";
import { useLocation } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import card1 from '../../images/visa.sxIq5Dot (1).svg';
import card2 from '../../images/mastercard.1c4_lyMp.svg';
import card3 from '../../images/amex.Csr7hRoy.svg';
import card4 from '../../images/discover.C7UbFpNb.svg';
import crossbtn from '../../images/unnamed.png';
import cross from '../../images/cross.png';
import gapy from '../../images/gapy1.png';
import pay from '../../images/pay1.png';
import polygon from '../../images/Polygon 2.png';
import thankuu from '../../images/thankuu.png';
import discount from '../../images/discount.png';
import downicon from '../../images/downicon.webp';
import payment from '../../images/payment.webp';
import plus from '../../images/plus.webp';
import minus from '../../images/minus.webp';
import discount1 from '../../images/discount1.webp';
import remove from '../../images/remove.webp';
import blackreview from '../../images/review.webp';
import blackproduct from '../../images/product.webp';
import blackvideo from '../../images/video.webp';
import blackhurryUp from '../../images/hurryUp.webp';
import blackmulticolumn from '../../images/multicolumn.webp';
import whitereview from '../../images/whitereview.webp';
import whiteproduct from '../../images/whiteproduct.webp';
import whitevideo from '../../images/whitevideo.webp';
import whitehurryUp from '../../images/whitehurryUp.webp';
import whitemulticolumn from '../../images/whitemulticolumn.webp';
import richBlack from '../../images/rich.webp';
import whiterich from '../../images/richwhite.webp';
import ReviewProduct from '../../components/checkout-V1/sidebar/Review-product';
import ReviewText from '../../components/checkout-V1/sidebar/Review-text';
import ReviewVideo from '../../components/checkout-V1/sidebar/Review-video';
import UrgencyBar from '../../components/checkout-V1/sidebar/UrgencyBar';
import TrustBages from '../../components/checkout-V1/sidebar/Trust-bages';
import RichText from "../../components/checkout-V1/sidebar/RichText";
import Bar from '../../components/checkout-V1/sidebar/Bar';
import Banner from "../../components/checkout-V1/Banner";
import Thankyou from '../../components/checkout-V1/Thankyou';
import Sidebar from '../../components/checkout-V1/sidebar/Sidebar';
import { useCart } from "../../components/checkout-V1/CartContext";
import { useShopify } from "../../components/main-dashboard/dashboard-Pages/ShopifyContext";
import Verification from "./Verification";
import Address from "./Address";
import Step from "./Step";
import Shipping from "./Shipping";
import PaymentOption from "./PaymentOptions";
import PaymentPage from "./PaymentPage";
import Contact from "./Contact";
import Product from "./Product";
import Discount from "./Discount";
import SkeletonPage from "../loader/Skeleton-page";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const paymentOptions = [
    { id: 1, title: "Credit card", type: "card" },
    { id: 2, title: "Cash on Delivery (COD)", type: "cash" },
    { id: 3, title: "Wallets", type: "wallet" },
    { id: 4, title: "UPI", type: "upi" },
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

export default function CheckoutV2() {
    const { selectedOption, setSelectedOption, activeOption } = useShopify();
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
    const [videoInputs, setVideoInputs] = useState({ videos: [], display: 'slider', itemsPerRow: 2 });
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState('');
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
    const [activePaymentType, setActivePaymentType] = useState(null);
    const [productHeading, setProductHeading] = useState("");
    const [richInputs, setRichInputs] = useState([])
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
    const [checkOutBtnBgColor, setCheckOutBtnBgColor] = useState('#2b737d');
    const [showProducts, setShowProducts] = useState(false);
    const [showPaymentCard, setShowPaymentCard] = useState(false);
    const [activeStep, setActiveStep] = useState(
        localStorage.getItem("activeStep") || "mobile"
    );
    const [mobileVerified, setMobileVerified] = useState(
        localStorage.getItem("mobileVerified") === "true"
    );
    const [isVisible, setIsVisible] = useState(true);
    const [showPopupCustom, setShowPopupCustom] = useState(false);
    const [isHiding, setIsHiding] = useState(false);
    const [showPopupOptions, setShowPopupOptions] = useState(false);
    const [showCodPopup, setShowCodPopup] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [CheckoutPaymentOtions, setCheckoutPaymentOtions] = useState([paymentOptions[0].type]);
    const checkoutRef = useRef(null);
    const savedOptions = localStorage.getItem("contactOptions");
    const initialOptions = savedOptions ? JSON.parse(savedOptions) : ["phone"];
    const [contactOptions, setContactOptions] = useState(initialOptions);
    const [showProductPopup, setShowProductPopup] = useState(false);
    const [hiddenSections, setHiddenSections] = useState([]);
    const [sideBarSection, setSideBarSection] = useState(false);
    const [customData, setCustomData] = useState(null);

    useEffect(() => {
        if (cartData?.lines?.edges?.length === 0) {
            setShowProducts(false);
        }
    }, [cartData]);

    useEffect(() => {
        if (!checkoutRef.current) return;

        const anyPopupOpen =
            showPopupOptions || showPopupCustom || showCodPopup || showProducts || showPopup;

        checkoutRef.current.style.overflowY = anyPopupOpen ? "hidden" : "auto";
        checkoutRef.current.style.height = "89.8vh";

    }, [showPopupOptions, showPopupCustom, showCodPopup, showProducts, showPopup]);

    const handleHideClick = () => {
        if (activeStep === "address") {
            setShowPopupCustom(false);
            setActiveStep("mobile");
        }

        if (selectedPayment?.title === "Credit card") {
            setShowPopupCustom(false);
            setShowPaymentCard(false);
            setSelectedPayment(null);
            setActivePaymentType(null);
            setActiveStep("address");
        }

        if (activeStep !== "address" && selectedPayment?.title !== "Credit card") {
            setShowPopupCustom(true);
        }
    };

    const handleConfirmHide = () => {
        setIsHiding(true);
        setShowPopupCustom(false);
        setTimeout(() => {
            setIsVisible(false);
            setIsHiding(false);
        }, 300);
    };
    const handleCancel = () => {
        setShowPopupCustom(false);
    };

    useEffect(() => {
        if (storefrontToken) {
            localStorage.setItem("storefrontToken", storefrontToken);
        }
    }, [storefrontToken]);

    useEffect(() => {
        const savedStep = localStorage.getItem("activeStep");
        const savedVerified = localStorage.getItem("mobileVerified") === "true";
        if (savedStep) setActiveStep(savedStep);
        if (savedVerified) setMobileVerified(true);
    }, []);

    useEffect(() => {
        localStorage.setItem("activeStep", activeStep);
        localStorage.setItem("mobileVerified", mobileVerified);
    }, [activeStep, mobileVerified]);


    const handleOtpVerified = () => {
        setMobileVerified(true);
        setActiveStep("address");
    };

    const handleLogout = () => {
        localStorage.removeItem("mobileNumber");
        localStorage.removeItem("contactInfo");
        localStorage.removeItem("loginEmail");

        setInput('');
        setMobileVerified(true);
        setActiveStep("mobile");
    };

    const handleEdit = () => {
        setActiveStep("mobile");
        setInput("");
    };

    const storedMobile = localStorage.getItem("mobileNumber") || "";
    const storedEmail = localStorage.getItem("loginEmail") || "";

    const [customers, setCustomers] = useState([]);
    const [hasAddress, setHasAddress] = useState(false);

    useEffect(() => {
        if (!shop) return;

        const fetchCustomers = async () => {
            try {
                const res = await fetch(`${apiBaseUrl}/customers-item?shop=${shop}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    let shopCustomers = data.data.filter(c => c.phone === storedMobile);

                    if (shopCustomers.length === 0 && storedEmail) {
                        shopCustomers = data.data.filter(c => c.email === storedEmail);
                    }

                    setCustomers(shopCustomers);
                } else {
                    setCustomers([]);
                }
            } catch (err) {
                console.error("Error fetching customers:", err);
                setCustomers([]);
            }
        };

        fetchCustomers();
    }, [shop, apiBaseUrl, storedMobile, storedEmail]);

    useEffect(() => {
        setHasAddress(customers && customers.length > 0);
    }, [customers]);

    const handleOrderClick = () => {
        setShowProducts(prev => !prev);
    };

    useEffect(() => {
        localStorage.setItem("bgColor", bgColor);
    }, [bgColor]);

    useEffect(() => {
        localStorage.setItem("bgImage", bgImage);
    }, [bgImage]);

    const location = useLocation();
    const isCheckoutPageV2 = location.pathname === "/checkoutv2";

    useEffect(() => {
        localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("selectedSections", JSON.stringify(selectedSections));
        }
    }, [selectedSections]);


    // const currencyCode = cartData?.lines?.edges?.[0]?.node?.merchandise?.price?.currencyCode;
    // console.log(currencyCode);

    const [selectedCountry, setSelectedCountry] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem('selectedCountry') || '';
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
                phone: '',
                email: ''
            };
        }
        return {
            firstName: '',
            lastName: '',
            address: '',
            apartment: '',
            city: '',
            phone: '',
            email: ''
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
    const [updatingLineId, setUpdatingLineId] = useState(null);
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

    const handleRemoveFreeShipping = () => {
        setFreeShippingCode(null);
        localStorage.removeItem("appliedFreeShippingCode");
    };


    const handleCountryChange = async (e) => {
        const selected = e.target.value;
        setSelectedCountry(selected);
        setPin("");
        setSelectedProvince("");
        setDeliveryData(prev => ({
            ...prev,
            address: "",
            city: "",
            firstName: "",
            lastName: "",
            apartment: "",
            phone: "",
            email: ""
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
        try {


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
    const [currencyRates, setCurrencyRates] = useState({});

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const cachedRates = localStorage.getItem("currencyRates");
                if (cachedRates) {
                    setCurrencyRates(JSON.parse(cachedRates));
                    return;
                }

                const response = await axios.get('https://api.unirateapi.com/api/rates', {
                    params: {
                        api_key: 'fd4zbA40dtNfpRzWnNg2hK3f4r0dBWEDOe3OfW1skaU2GBCOxltg0Q0KlwknSnfm',
                        from: 'INR',
                    },
                });

                const rates = response.data?.rates || {};
                setCurrencyRates(rates);
                localStorage.setItem("currencyRates", JSON.stringify(rates));

            } catch (error) {
                console.error("Error fetching currency rates:", error);
            }
        };

        fetchRates();
    }, []);

    useEffect(() => {
        if (!selectedShipping?.price) {
            setShippingAmount(null);
            return;
        }

        const shipping = parseFloat(selectedShipping.price);
        const rate = currencyRates[currency] || 1;
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
                (finalTotal + totalEstimatedTax) >= (freeShippingCode?.minSubtotal || 0)) ||

            discounts?.some((d) => {
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
            console.log("✅ Free shipping applied — subtotal:", finalTotal + totalEstimatedTax, "quantity:", totalQuantity);
            converted = 0;
        } else {
            console.log("❌ No free shipping — subtotal:", finalTotal + totalEstimatedTax, "quantity:", totalQuantity);
        }

        setShippingAmount(roundToTwo(converted));
    }, [selectedShipping, currency, currencyRates, finalTotal, totalEstimatedTax, discounts,
        appliedCode, productDiscounts, freeShippingCode, cartData
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

        console.log("deliveryData:", deliveryData);
        console.log("selectedProvince:", selectedProvince);
        console.log("pin:", pin);

        if (!deliveryData.lastName?.trim()) {
            newErrors.lastName = "Enter a last name";
            hasError = true;
        }

        if (!deliveryData.address?.trim()) {
            newErrors.address = "Enter an address";
            hasError = true;
        }

        if (!deliveryData.city?.trim()) {
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

        console.log("newErrors:", newErrors);
        console.log("provinceError:", provinceErrorLocal);
        console.log("pinError:", pinErrorLocal);
        console.log("hasError:", hasError);

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

    const handlePayNow = async () => {
        setLoading(true);
        const isFieldsValid = validateFields();
        const isCardValid = true;

        if (!isFieldsValid || (selectedPayment?.type === "card" && !isCardValid)) {
            alert("Please fill all required fields correctly.");
            setLoading(false);
            return;
        }

        const cartItems = cartData?.lines?.edges || [];
        if (cartItems.length === 0) {
            alert("Please select at least one product before proceeding.");
            setLoading(false);
            return;
        }

        const amount = parseFloat(finalTotal || 0).toFixed(2);
        const taxAmount = parseFloat(totalEstimatedTax || 0).toFixed(2);

        const billing = {
            firstname: billingAddress?.firstName || deliveryData?.firstName || "",
            lastname: billingAddress?.lastName || deliveryData?.lastName || "",
            address: billingAddress?.address || deliveryData?.address || "",
            apartment: billingAddress?.apartment || deliveryData?.apartment || "",
            city: billingAddress?.city || deliveryData?.city || "",
            state: billingAddress?.state || selectedProvince || "",
            pin: billingAddress?.postalCode || pin || "",
            country: billingAddress?.country || selectedCountry || "IN",
            phone: billingAddress?.phone || deliveryData?.phone || ""
        };

        const tax = {
            name: taxCountries?.name || "IGST",
            rate: taxCountries?.rate || 0.18,
            amount: taxAmount
        };

        const orderSummary = {
            currency,
            customer: {
                firstname: deliveryData?.firstName || "",
                lastname: deliveryData?.lastName || "",
                email: input,
                pin,
                country: selectedCountry,
                state: selectedProvince || "",
                city: deliveryData?.city || "",
                address: deliveryData?.address || "",
                apartment: deliveryData?.apartment || "",
                phone: deliveryData?.phone || ""
            },
            billing,
            shipping: {
                method: selectedShipping?.title || "Standard Shipping",
                amount: parseFloat(shippingAmount || 0).toFixed(2)
            },
            items: cartData?.lines?.edges?.map(({ node }) => {
                const product = node?.merchandise?.product;
                const variant = node?.merchandise;
                const originalPrice = parseFloat(variant?.price?.amount) || 0;
                const productId = product?.id?.replace("gid://shopify/Product/", "");
                const discount = productDiscounts?.[productId];

                return {
                    title: product?.title,
                    variant: variant?.title,
                    quantity: node?.quantity,
                    price: originalPrice.toFixed(2),
                    discount: discount
                        ? {
                            title: discount.title,
                            amount: parseFloat(discount.amount).toFixed(2),
                            type: discount.type
                        }
                        : null,
                    image: variant?.image?.url || product?.featuredImage?.url || "",
                    variant_id: variant?.id?.replace("gid://shopify/ProductVariant/", "") || null
                };
            }) || [],
            discount: discountDetails?.code
                ? {
                    code: discountDetails.code,
                    amount: parseFloat(discountDetails.amount).toFixed(2)
                }
                : null,
            tax,
            total: amount,
            amount_charged: (parseFloat(amount) + parseFloat(taxAmount)).toFixed(2),
            payment: {}
        };

        try {
            if (selectedPayment?.type === "cash") {
                orderSummary.payment.type = "cash";
                orderSummary.payment.card = null;
                const res = await fetch(`${apiBaseUrl}/api/complete-order`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order: orderSummary, cart_id: cartData?.id, shop, accessToken, storefrontToken }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Cash order failed");

                alert("✅ Order placed successfully (Cash on Delivery)");
                setShowThankyouPage(true);

                localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
                ["deliveryData", "pin", "selectedProvince", "contactInfo", "appliedDiscountCode", "appliedFreeShippingCode"].forEach(item => localStorage.removeItem(item));
                setLoading(false);
                return;
            }

            if (selectedPayment?.type === "upi" || selectedPayment?.type === "wallet") {
                const orderRes = await fetch(`${apiBaseUrl}/create-order`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: parseFloat(amount) + parseFloat(taxAmount),
                        currency,
                        razorpayID,
                        razorpayKey
                    }),
                });

                const orderData = await orderRes.json();
                const isUPI = selectedPayment?.type === "upi";
                const isWallet = selectedPayment?.type === "wallet";

                const options = {
                    key: razorpayID,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "Shopify Order",
                    description: `Payment via ${selectedPayment.type}`,
                    order_id: orderData.id,
                    handler: function (response) {
                        alert("✅ Payment successful! Completing your order...");
                        setShowThankyouPage(true);

                        (async () => {
                            try {
                                orderSummary.payment.type = selectedPayment.type;
                                orderSummary.payment.razorpay_payment_id = response.razorpay_payment_id;

                                const res = await fetch(`${apiBaseUrl}/api/complete-order`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        order: orderSummary, cart_id: cartData?.id, shop, accessToken, storefrontToken
                                    })
                                });

                                const data = await res.json();
                                if (!res.ok) throw new Error(data?.error || "Order failed");

                                localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
                                ["deliveryData", "pin", "selectedProvince", "contactInfo", "appliedDiscountCode", "appliedFreeShippingCode"].forEach(item => localStorage.removeItem(item));
                            } catch (err) {
                                console.error("Order completion failed:", err);
                            }
                        })();
                    },
                    theme: { color: "#3399cc" },
                    method: {
                        upi: isUPI,
                        wallet: isWallet,
                        card: false,
                        netbanking: false,
                        paylater: false,
                    },
                    prefill: isUPI ? { method: "upi" } : isWallet ? { method: "wallet" } : {},
                    modal: { ondismiss: function () { alert("Payment cancelled"); setSelectedPayment(null); } },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();

                setLoading(false);
                return;
            }
        } catch (err) {
            console.error("❌ Error during checkout:", err);
            alert("❌ Something went wrong: " + err.message);
        } finally {
            setLoading(false);
        }
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

    const [height, setHeight] = useState("50vh");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setHeight(isCheckoutPageV2 ? "90vh" : "90vh");
        }, 100);
        return () => clearTimeout(timeout);
    }, [isCheckoutPageV2]);

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

    return (
        <div className="custom-checkout" >
            <div className="container-checkout">
                {!isCheckoutPageV2 && (<Bar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setActiveSetting={setActiveSetting}
                    setSaveData={setSaveData}
                    saveData={saveData}
                />)}
                <div className="checkout-warp-cont no-sidebar input-wrapp">
                    <div className='checkout-warp-cont-side-bar' style={{ display: isCheckoutPageV2 ? "none" : "block" }}>
                        <Sidebar
                            sections={sections}
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
                            selectedOption={selectedOption}
                            setSelectedOption={setSelectedOption}
                            activeOption={activeOption}
                            sectionsWithImagesWhite={sectionsWithImagesWhite}
                            sectionsWithImagesBlack={sectionsWithImagesBlack}
                            productHeading={productHeading}
                            setProductHeading={setProductHeading}
                            setRichInputs={setRichInputs}
                            richInputs={richInputs}
                            setCheckOutBtnBgColor={setCheckOutBtnBgColor}
                            checkOutBtnBgColor={checkOutBtnBgColor}
                            setCheckoutPaymentOtions={setCheckoutPaymentOtions}
                            CheckoutPaymentOtions={CheckoutPaymentOtions}
                            paymentOptions={paymentOptions}
                            contactOptions={contactOptions}
                            setContactOptions={setContactOptions}
                            setHiddenSections={setHiddenSections}
                            hiddenSections={hiddenSections}
                            sideBarSection={sideBarSection}
                            setSideBarSection={setSideBarSection}
                            setShowProductPopup={setShowProductPopup}
                            showProductPopup={showProductPopup}
                        />
                    </div>
                    <div
                        className={`checkout-page-banner-v2 ${isHiding ? "hiding" : ""}
                         ${!isCheckoutPageV2 ? "custom-width" : ""}`}
                        style={{
                            display: isVisible ? "block" : "none",
                            width: isCheckoutPageV2 ? "100%" : "80%",
                            transition: "width 0.3s",
                            height: isCheckoutPageV2 ? "100vh" : "95vh",
                        }}>

                        <div className='checkout-page-banner-wrapp-v2' style={{
                            left: "50%",
                            top: "50%",
                            height: height,
                            backgroundColor: bgColor,
                            backgroundImage: `url('${apiBaseUrl}/${bgImage}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            transform: "translate(-50%, -50%)",
                            transition: "height 1s ease",
                            position: "absolute",
                            width: "100%",
                        }}>
                            {!customData ? (
                                <div className="checkout-loading">
                                    <SkeletonPage />
                                </div>
                            ) : (
                                <div className='checkout-container' ref={checkoutRef} >
                                    <div className='checkout-warp-cont-left-side-v2'>
                                        <div className="checkout-warp-v2">
                                            <div className="custom-checkoutv2-logo">
                                                <div className="checkout-hide" onClick={handleHideClick}>
                                                    <img src={polygon} alt="" />
                                                </div>
                                                <Banner
                                                    setLogo={setLogo}
                                                    logo={logo}
                                                    setHideLogo={setHideLogo}
                                                    hideLogo={hideLogo}
                                                    setSideHideLogo={setSideHideLogo}
                                                    hideSideLogo={hideSideLogo}
                                                    setSideLogo={setSideLogo}
                                                    sidelogo={sidelogo}
                                                    selectedOption={selectedOption}
                                                />
                                                <Step
                                                    setActiveStep={setActiveStep}
                                                    mobileVerified={mobileVerified}
                                                    activeStep={activeStep}
                                                    hasAddress={hasAddress}
                                                    showThankyouPage={showThankyouPage}
                                                />
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
                                                    handleOrderClick={handleOrderClick}
                                                    showProducts={showProducts}
                                                    setShowProducts={setShowProducts}
                                                    downicon={downicon}
                                                    plus={plus}
                                                    minus={minus}
                                                    remove={remove}
                                                    discount1={discount1}
                                                />
                                            </div>
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
                                                    <div className="custom-checkout-dashboard">
                                                        <div className="custom-checkout-dashboard-wrap">
                                                            {selectedPayment?.title !== "Credit card" && (
                                                                <>
                                                                    {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                                                                        (section) =>
                                                                            selectedSections.includes(section) &&
                                                                            sectionPositions[section] === "aboveDiscount" && (
                                                                                <React.Fragment key={section}>
                                                                                    {sectionComponents[section]}
                                                                                </React.Fragment>
                                                                            )
                                                                    )}
                                                                    <Discount
                                                                        code={code}
                                                                        setCode={setCode}
                                                                        handleApply={handleApply}
                                                                        loading={loading}
                                                                        message={message}
                                                                        success={success}
                                                                        appliedCode={appliedCode}
                                                                        discount={discount}
                                                                        handleRemove={handleRemove}
                                                                        crossbtn={crossbtn}
                                                                        freeShippingCode={freeShippingCode}
                                                                        handleRemoveFreeShipping={handleRemoveFreeShipping}
                                                                        discountDetails={discountDetails}
                                                                        getCurrencySymbol={getCurrencySymbol}
                                                                        currency={currency}
                                                                    />
                                                                </>
                                                            )}

                                                            {activeStep === "mobile" && (
                                                                <>
                                                                    {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                                                                        (section) =>
                                                                            selectedSections.includes(section) &&
                                                                            sectionPositions[section] === "aboveNumber" && (
                                                                                <React.Fragment key={section}>
                                                                                    {sectionComponents[section]}
                                                                                </React.Fragment>
                                                                            )
                                                                    )}

                                                                    <Verification onOtpVerified={handleOtpVerified}
                                                                        contactOptions={contactOptions}
                                                                    />
                                                                    {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                                                                        (section) =>
                                                                            selectedSections.includes(section) &&
                                                                            sectionPositions[section] === "underNumber" && (
                                                                                <React.Fragment key={section}>
                                                                                    {sectionComponents[section]}
                                                                                </React.Fragment>
                                                                            )
                                                                    )}

                                                                </>
                                                            )}

                                                            {activeStep === "address" && (mobileVerified || hasAddress) && (
                                                                showPaymentCard ? (
                                                                    <>
                                                                        <PaymentPage
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
                                                                            complete={complete}
                                                                            totalEstimatedTax={totalEstimatedTax}
                                                                            stripePublishableKey={stripePublishableKey}
                                                                            shop={shop}
                                                                            accessToken={accessToken}
                                                                            setCardErrors={setCardErrors}
                                                                            stripeSecretKey={stripeSecretKey}
                                                                            setShowThankyouPage={setShowThankyouPage}
                                                                            storefrontToken={storefrontToken}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <>
                                                                            {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                                                                                (section) =>
                                                                                    selectedSections.includes(section) &&
                                                                                    sectionPositions[section] === "aboveDelivery" && (
                                                                                        <React.Fragment key={section}>
                                                                                            {sectionComponents[section]}
                                                                                        </React.Fragment>
                                                                                    )
                                                                            )}
                                                                            <Address
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
                                                                                shop={shop}
                                                                                accessToken={accessToken}
                                                                                setErrors={setErrors}
                                                                                refreshCart={refreshCart}
                                                                                setCurrency={setCurrency}
                                                                                setCustomers={setCustomers}
                                                                                customers={customers}
                                                                                setShowPopupOptions={setShowPopupOptions}
                                                                                showPopupOptions={showPopupOptions}
                                                                                setInput={setInput}
                                                                                input={input}
                                                                                setShowPopup={setShowPopup}
                                                                                showPopup={showPopup}
                                                                                storefrontToken={storefrontToken}
                                                                            />
                                                                            {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                                                                                (section) =>
                                                                                    selectedSections.includes(section) &&
                                                                                    sectionPositions[section] === "underDelivery" && (
                                                                                        <React.Fragment key={section}>
                                                                                            {sectionComponents[section]}
                                                                                        </React.Fragment>
                                                                                    )
                                                                            )}
                                                                        </>

                                                                        <Contact
                                                                            gapy={gapy}
                                                                            pay={pay}
                                                                            handleChange={handleChange}
                                                                            input={input}
                                                                            error={error}
                                                                            shop={shop}
                                                                            storedMobile={storedMobile}
                                                                            validateInput={validateInput}
                                                                            handleEdit={handleEdit}
                                                                            setInput={setInput}
                                                                        />

                                                                        {customers && customers.length > 0 && (
                                                                            <>
                                                                                <>
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
                                                                                </>
                                                                                <div className="checkout-payment-method checkout-v2">
                                                                                    <div className="checkout-payment-wrapped">
                                                                                        <div className="checkout-add-img">
                                                                                            <img src={payment} alt="" />
                                                                                        </div>
                                                                                        <h5>Payment Options</h5>
                                                                                    </div>
                                                                                    <PaymentOption
                                                                                        paymentOptions={paymentOptions}
                                                                                        setSelectedPayment={setSelectedPayment}
                                                                                        selectedPayment={selectedPayment}
                                                                                        card1={card1}
                                                                                        card2={card2}
                                                                                        card3={card3}
                                                                                        card4={card4}
                                                                                        getCurrencySymbol={getCurrencySymbol}
                                                                                        finalTotal={finalTotal}
                                                                                        totalEstimatedTax={totalEstimatedTax}
                                                                                        setShowPaymentCard={setShowPaymentCard}
                                                                                        showPaymentCard={showPaymentCard}
                                                                                        handlePayNow={handlePayNow}
                                                                                        currency={currency}
                                                                                        setActivePaymentType={setActivePaymentType}
                                                                                        setShowCodPopup={setShowCodPopup}
                                                                                        showCodPopup={showCodPopup}
                                                                                        activePaymentType={activePaymentType}
                                                                                        storefrontToken={storefrontToken}
                                                                                        setCheckoutPaymentOtions={setCheckoutPaymentOtions}
                                                                                        CheckoutPaymentOtions={CheckoutPaymentOtions}
                                                                                    />
                                                                                    {["review", "product", "video", "urgencyBar", "trustBages", "richtext"].map(
                                                                                        (section) =>
                                                                                            selectedSections.includes(section) &&
                                                                                            sectionPositions[section] === "underPayment" && (
                                                                                                <React.Fragment key={section}>
                                                                                                    {sectionComponents[section]}
                                                                                                </React.Fragment>
                                                                                            )
                                                                                    )}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                        <div className="checkout-login">
                                                                            {storedMobile || storedEmail ? (
                                                                                <>
                                                                                    <p>Logged in using {storedMobile}{" "}{storedEmail} </p>
                                                                                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                                                                                </>
                                                                            ) : (
                                                                                "Not logged in"
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                )
                                                            )}
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
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {showPopupCustom && (
                                        <div className="popup-overlay hide-checkout">
                                            <div className="popup-box">
                                                <div className="popup-actions-cross" onClick={handleCancel}><img src={cross} alt="" /></div>
                                                <p>Are You Sure You Want to Cencel Payment?</p>
                                                <div className="popup-actions">
                                                    <button className="popup-btns" onClick={handleConfirmHide}>Yes</button>
                                                    <button className="popup-btns no" onClick={handleCancel}>No</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
