import { useState, useEffect, useRef } from "react";
import { countries } from "country-data";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css"
import location from '../../images/location.webp';
import hous from '../../images/hous.webp';
import edit from '../../images/edit.webp';
import options from '../../images/options.png';
import addnew from '../../images/addnew.webp';
import whitedit from '../../images/whitedit.webp';
import select from '../../images/select.webp';
import deletebtn from '../../images/delete.webp';
import whiteselect from '../../images/whiteselect.webp';
import whitedelete from '../../images/whitedelete.webp';
import cross from '../../images/cross.png';
import friendly from '../../images/friendly.webp';
import work from '../../images/work.webp';
import searchicon from '../../images/searchicon.png';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function Address({ handleInputChange, deliveryData, showNumber, handleNumber, shipping, selectedCountry,
    setSelectedCountry, selectedProvince, setSelectedProvince, pin, setPin, errors, validateFields, handleCountryChange,
    provinceError, setProvinceError, pinFormatError, setPinFormatError, pinProvinceError, setPinProvinceError, cartData,
    setAddressSuggestions, addressSuggestions, setAddressQuery, addressQuery, shop, setErrors, refreshCart, setCurrency,
    customers, setCustomers, accessToken, showPopupOptions, setShowPopupOptions, setShowPopup, showPopup, storefrontToken
}) {

    const deliveryZones = shipping || [];
    const [provinces, setProvinces] = useState([]);
    const [pinTouched, setPinTouched] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [openOptionsId, setOpenOptionsId] = useState(null);
    const [selectedAddressType, setSelectedAddressType] = useState("Home");
    const optionsRef = useRef(null);

    const [selectedCustomerId, setSelectedCustomerId] = useState(
        localStorage.getItem("selectedCustomerId") || null
    ); 
    const [editingCustomerId, setEditingCustomerId] = useState(null);

    const [storedMobile, setStoredMobile] = useState("");
    const [storedEmail, setStoredEmail] = useState("");

    useEffect(() => {
        if (!selectedCountry) {
            setProvinces([]);
            setSelectedProvince("");
            return;
        }

        const matchedCountry = deliveryZones.find(c => c.code === selectedCountry);

        if (matchedCountry?.provinces?.length > 0) {
            setProvinces(matchedCountry.provinces);
            if (!matchedCountry.provinces.some(p => p.code === selectedProvince)) {
                setSelectedProvince("");
            }
        } else {
            setProvinces([]);
            setSelectedProvince("");
        }
    }, [selectedCountry, deliveryZones, selectedProvince]);

    const handleProvinceChange = (e) => {
        const value = e.target.value;
        setSelectedProvince(value);
        if (value) setProvinceError("");
    };

    useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('selectedCountry', selectedCountry); }, [selectedCountry]);
    useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('selectedProvince', selectedProvince); }, [selectedProvince]);
    useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('pin', pin); }, [pin]);

    const handlePinChange = (e) => {
        const value = e.target.value;
        setPin(value);
        setPinTouched(true);

        if (/^\d{6}$/.test(value)) {
            setPinFormatError("");
        }

        setPinProvinceError("");
    };

    useEffect(() => {
        const validatePin = async () => {
            if (!pinTouched) return;
            if (pin.length === 0) {
                setPinFormatError("");
                setPinProvinceError("");
                return;
            }

            if (selectedCountry === "IN") {
                const selectedProvinceName = provinces.find(p => p.code === selectedProvince)?.name;
                if (!selectedProvinceName) {
                    setPinProvinceError("Invalid province selected");
                    return;
                }

                try {
                    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                    const data = await res.json();
                    if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
                        const pinState = data[0].PostOffice[0].State;
                        if (!pinState.toLowerCase().includes(selectedProvinceName.toLowerCase())) {
                            setPinProvinceError(`Enter a valid PIN for (${selectedProvinceName})`);
                        } else setPinProvinceError("");
                    } else setPinProvinceError("Invalid PIN code");
                } catch (err) {
                    setPinProvinceError("Error validating PIN code");
                }
            } else {
                if (pin.length < 4) setPinFormatError("Enter a valid ZIP / postal code");
                else setPinFormatError("");
                setPinProvinceError("");
            }
        };

        validatePin();
    }, [pin, selectedProvince, provinces, pinTouched, selectedCountry]);

    const handleAddressChange = async (value) => {
        handleInputChange("address", value);
        setAddressQuery(value);

        if (value.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        try {
            const countryParam = selectedCountry ? `&countrycodes=${selectedCountry.toLowerCase()}` : "";
            const res = await fetch(`https://nominatim.openstreetmap.org/
                search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=5${countryParam}`);
            const data = await res.json();
            const suggestions = data.map(item => ({
                display_name: item.display_name,
                lat: item.lat,
                lon: item.lon,
                address: item.address
            }));
            setAddressSuggestions(suggestions);
        } catch (err) {
            console.error("Address fetch error", err);
            setAddressSuggestions([]);
        }
    };

    const handleAddressSelect = (address) => {
        if (!address) return;

        const displayName = address.display_name || "";
        handleInputChange("address", displayName);
        setAddressQuery(displayName);
        setAddressSuggestions([]);

        const addressInfo = address.address || {};
        const city = addressInfo.city || addressInfo.town || addressInfo.village || "";
        handleInputChange("city", city);

        if (addressInfo.postcode) setPin(addressInfo.postcode);

        if (addressInfo.state && provinces.length > 0) {
            const matchedProvince = provinces.find(
                p => p.name.toLowerCase() === addressInfo.state.toLowerCase()
            );
            if (matchedProvince) {
                setSelectedProvince(matchedProvince.code);
                setProvinceError("");
            }
        }
    };

    useEffect(() => {
        const mobile = localStorage.getItem("mobileNumber") || "";
        if (mobile) {
            setStoredMobile(mobile);
            handleInputChange("phone", mobile);
        }
        const email = localStorage.getItem("loginEmail") || "";
        if (email) {
            setStoredEmail(email);
            handleInputChange("email", email);
        }
    }, []);

    const clearErrors = () => {
        setErrors({
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            pin: "",
            phone: "",
            email: "",
        });
    };

    const handleAddNewAddress = () => {
        setIsAddingNew(true);
        setEditingCustomerId("new");
        handleInputChange("firstName", "");
        handleInputChange("lastName", "");
        handleInputChange("address", "");
        handleInputChange("apartment", "");
        handleInputChange("city", "");
        handleInputChange("phone", "");
        handleInputChange("email", "");
        setPin("");
        setSelectedProvince('')
        setAddressQuery("");
        setAddressSuggestions([]);
        clearErrors();
        setShowPopup(true);
    };

    const handleSelectCustomer = (customer) => {
        if (!customer) return;
        setSelectedCustomerId(customer.id);
        localStorage.setItem("selectedCustomerId", customer.id);
        handleInputChange("firstName", customer.first_name || "");
        handleInputChange("lastName", customer.last_name || "");
        handleInputChange("address", customer.address || "");
        handleInputChange("apartment", customer.apartment || "");
        handleInputChange("city", customer.city || "");
        handleInputChange("phone", customer.phone || "");
        handleInputChange("email", customer.email || "");

        setSelectedCountry(customer.country || "");
        setSelectedProvince(customer.state || "");
        setPin(customer.pin || "");
        setAddressQuery(customer.address || "");
        setShowPopupOptions(false);
        setOpenOptionsId(false);
    };

    const handleDeleteCustomer = async (customer) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;

        try {
            const res = await fetch(
                `${apiBaseUrl}/customers-details/${customer.id}?shop=${shop}`,
                { method: "DELETE" }
            );

            const data = await res.json();
            console.log("🗑️ Delete response:", data);

            if (data.success) {
                alert("Customer deleted successfully!");

                setCustomers(prev => prev.filter(c => c.id !== customer.id));
                setPopupCustomers(prev => prev.filter(c => c.id !== customer.id));

                if (selectedCustomerId === customer.id) {
                    setSelectedCustomerId(null);
                }
            } else {
                alert("Error deleting: " + data.error);
            }
        } catch (err) {
            console.error("🔥 Delete failed:", err);
            alert("Server error while deleting");
        }
    };

    const handleEditAddress = (customer) => {
        if (!customer) return;

        setEditingCustomerId(customer.id);
        setSelectedCustomerId(customer.id);

        handleInputChange("firstName", customer.first_name || "");
        handleInputChange("lastName", customer.last_name || "");
        handleInputChange("address", customer.address || "");
        handleInputChange("apartment", customer.apartment || "");
        handleInputChange("city", customer.city || "");
        handleInputChange("phone", customer.phone || "");
        handleInputChange("email", customer.email || "");

        setSelectedCountry(customer.country || "");
        setSelectedProvince(customer.state || "");
        setPin(customer.pin || "");
        setAddressQuery(customer.address || "");
        setAddressSuggestions([]);
        setSelectedAddressType(customer.addressType || "Home");
        clearErrors();

        setTimeout(() => {
            setShowPopup(true);
        }, 0);
    };

    const saveCustomerData = async () => {
        const payload = {
            shop: shop || "MyShop",
            first_name: deliveryData.firstName,
            last_name: deliveryData.lastName,
            address: deliveryData.address,
            country: selectedCountry || "",
            apartment: deliveryData.apartment || "",
            city: deliveryData.city,
            state: selectedProvince || "",
            pin: pin,
            phone: deliveryData.phone || storedMobile,
            email: deliveryData.email || storedEmail,
            addressType: selectedAddressType,
        };

        console.log("Payload being sent:", payload);
        console.log("editingCustomerId:", editingCustomerId);

        try {
            let res, data;

            if (editingCustomerId && editingCustomerId !== "new") {
                console.log("Updating customer:", editingCustomerId);
                res = await fetch(`${apiBaseUrl}/customers-details/${editingCustomerId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                console.log("Creating new customer");
                res = await fetch(`${apiBaseUrl}/customers-details`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            console.log(" Response status:", res.status);
            data = await res.json();
            console.log(" Response data:", data);

            if (data.success) {
                alert(editingCustomerId ? "Customer updated successfully!" : "Customer saved successfully!");
                setEditingCustomerId(null);
                const fetchRes = await fetch(`${apiBaseUrl}/customers-item?shop=${shop}`);
                const fetchData = await fetchRes.json();

                if (fetchData.success && Array.isArray(fetchData.data)) {
                    const shopCustomers = fetchData.data.filter(c => c.shop === shop);
                    setCustomers(shopCustomers);
                    const savedCustomer = editingCustomerId && editingCustomerId !== "new"
                        ? shopCustomers.find(c => c.id === editingCustomerId)
                        : shopCustomers[shopCustomers.length - 1];

                    if (savedCustomer) {
                        setSelectedCustomerId(savedCustomer.id);
                        handleSelectAddress(savedCustomer);
                    }
                }

                setShowPopup(false);
                setShowPopupOptions(false);
            } else {
                console.error(" API returned error:", data);
                alert("API error: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error(" Server/network error:", err);
            alert("Server error: " + err.message);
        }
    };

    const handleSelectAddress = async (customer) => {
        if (!customer) return;
        setSelectedCustomerId(customer.id);
        setEditingCustomerId(customer.id);
        localStorage.setItem("selectedCustomerId", customer.id);

        handleInputChange("firstName", customer.first_name || "");
        handleInputChange("lastName", customer.last_name || "");
        handleInputChange("address", customer.address || "");
        handleInputChange("apartment", customer.apartment || "");
        handleInputChange("city", customer.city || "");
        handleInputChange("phone", customer.phone || "");
        handleInputChange("email", customer.email || "");

        const country = customer.country || "";
        setSelectedCountry(country);
        localStorage.setItem("selectedCountry", country);

        let provinceCode = "";
        if (customer.state && provinces.length > 0) {
            const matchedProvince = provinces.find(
                (p) =>
                    p.code.toLowerCase() === customer.state.toLowerCase() ||
                    p.name.toLowerCase() === customer.state.toLowerCase()
            );
            if (matchedProvince) {
                provinceCode = matchedProvince.code;
                setSelectedProvince(provinceCode);
            } else {
                setSelectedProvince("");
            }
        } else {
            setSelectedProvince("");
        }
        localStorage.setItem("selectedProvince", provinceCode);

        const pinValue = customer.pin || "";
        setPin(pinValue);
        localStorage.setItem("pin", pinValue);
        setAddressQuery(customer.address || "");

        try {
            let updatedCurrency = "";
            try {
                const countryInfo = Object.values(countries).find(
                    (c) =>
                        c.alpha2?.toUpperCase() === customer.country?.toUpperCase() ||
                        c.code?.toUpperCase() === customer.country?.toUpperCase()
                );
                updatedCurrency = countryInfo?.currencies?.[0] || "";
            } catch (err) {
                console.warn("⚠️ Could not map currency for country:", customer.country, err);
            }
            const url = new URL(window.location.href);
            const cartToken = url.searchParams.get("cart_token");
            let cartId = cartToken || localStorage.getItem("cart_token");

            if (cartId && !cartId.startsWith("gid://shopify/Cart/")) {
                cartId = `gid://shopify/Cart/${cartId}`;
            }

            const lineId = cartData?.lines?.edges?.[0]?.node?.id || null;
            const response = await fetch(`${apiBaseUrl}/update-country`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cart_id: cartId,
                    currency: updatedCurrency,
                    countryCode: country,
                    line_id: lineId,
                    shop,
                    accessToken,
                    storefrontToken
                }),
            });

            const data = await response.json();
            refreshCart();
            if (data.success && updatedCurrency) {

            }
        } catch (error) {
            console.error("Failed to update country:", error);
        }
    };

    useEffect(() => {
        if (isAddingNew) return;

        if (customers && customers.length > 0) {
            const filteredCustomers = selectedCountry
                ? customers.filter(c => c.country === selectedCountry)
                : customers;

            if (filteredCustomers.length === 0) {
                handleAddNewAddress();
                return;
            }

            const savedId = localStorage.getItem("selectedCustomerId");
            const savedCustomer = filteredCustomers.find(c => String(c.id) === savedId);
            const customerToSelect = savedCustomer || filteredCustomers[0];

            if (customerToSelect) {
                handleSelectAddress(customerToSelect);
            }
        } else {
            const timer = setTimeout(() => {
                handleAddNewAddress();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [customers, provinces, selectedCountry, isAddingNew]);

    const handleClosePopup = () => {
        setIsAddingNew(false);
        const savedId = localStorage.getItem("selectedCustomerId");
        const savedCustomer = customers.find(c => String(c.id) === savedId);

        const customerToSelect = savedCustomer || customers[0];

        if (customerToSelect) {
            handleSelectAddress(customerToSelect);

            if (customerToSelect.state && provinces.length > 0) {
                const matchedProvince = provinces.find(
                    (p) =>
                        p.code.toLowerCase() === customerToSelect.state.toLowerCase() ||
                        p.name.toLowerCase() === customerToSelect.state.toLowerCase()
                );
                if (matchedProvince) {
                    setSelectedProvince(matchedProvince.code);
                    localStorage.setItem("selectedProvince", matchedProvince.code);
                }
            }
        }
        setShowPopup(false);
    };

    const [popupCustomers, setPopupCustomers] = useState([]);

    const handleEditOptions = () => {
        if (!selectedCustomerId) return;
        const validCustomers = customers.filter(c =>
            c.phone === storedMobile || c.email === storedEmail
        );

        const reordered = [
            validCustomers.find(c => c.id === selectedCustomerId),
            ...validCustomers.filter(c => c.id !== selectedCustomerId)
        ].filter(Boolean);

        setPopupCustomers(reordered);
        setShowPopupOptions(true);
    };

    const handleShow = (customerId) => {
        setOpenOptionsId(prevId => (prevId === customerId ? null : customerId));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setOpenOptionsId(false);
            }
        };

        if (openOptionsId) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openOptionsId]);

    const handleCancel = () => {
        setShowPopupOptions(false);
    }

    return (
        <>
            {customers.some(c => c.id === selectedCustomerId) && (
                <div className="delivery-to-checkout">
                    <div className="delivery-to-items">
                        {customers
                            .filter(c => c.id === selectedCustomerId)
                            .map((customer) => (
                                <div key={customer.id} className="customer-details-wraped selected">
                                    <div className="customer-details-items-sections">
                                        <div className="checkout-address-wrapped-sections">
                                            <div className="checkout-address-text">
                                                <div className="checkout-add-img">
                                                    <img src={location} alt="" />
                                                </div>
                                                <h5>Deliver To</h5>
                                            </div>
                                            <div className="checkout-address-wrapped-sections-addrres-type">
                                                {(() => {
                                                    const typeToShow = customer.addressType || "Home";
                                                    const icon = typeToShow === "Home" ? hous : typeToShow === "Friends/Family" ? friendly : work;

                                                    const width = typeToShow === "Friends/Family" ? "170px" : "120px";
                                                    return (
                                                        <div
                                                            className="checkout-address-text address-type"
                                                            style={{ width }}
                                                        >
                                                            <div className="checkout-add-img">
                                                                <img src={icon} alt={typeToShow} />
                                                            </div>
                                                            <h5>{typeToShow}</h5>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                        </div>

                                        <div className="customer-add-name">
                                            <p>{customer.first_name} {customer.last_name}</p>
                                        </div>
                                        <p className="customer-address-loactions">
                                            {customer.address}
                                            {customer.apartment ? `, ${customer.apartment}` : ""}
                                            <br />
                                            {customer.city}, {customer.state}, {customer.pin}
                                            <br />
                                        </p>
                                        <div className="customer-add-number">
                                            {customer.phone && customer.phone.replace(/\D/g, '').length > 2 && (
                                                <span>{customer.phone}</span>
                                            )}
                                            {customer.phone && customer.phone.replace(/\D/g, '').length > 2 && customer.email && (
                                                <span> | </span>
                                            )}
                                            {customer.email && <span>{customer.email}</span>}
                                        </div>
                                    </div>

                                    <button
                                        className="btn-edit"
                                        type="button"
                                        onClick={handleEditOptions}
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {showPopupOptions && (
                <div className="popup-overlay hide-checkout address items-popup">
                    <div className="popup-box">
                        <div className="popup-actions-cross" onClick={handleCancel}><img src={cross} alt="" /></div>
                        <h3>Select Delivery Address</h3>
                        <div className="add-new-address" onClick={handleAddNewAddress}><img src={addnew} alt="" />
                            <p>Add New Address</p></div>
                        <div className="customer-details-items-sections">
                            {popupCustomers.map(customer => {
                                const isSelected = customer.id === selectedCustomerId;
                                const isOptionsOpen = customer.id === openOptionsId;

                                return (
                                    <div
                                        key={customer.id}
                                        className={`customer-details-count ${isSelected ? "selected" : ""}`}
                                    >
                                        <div className="checkout-address-text-edit">
                                            <div className="checkout-address-wrapped-sections">
                                                {(() => {
                                                    const typeToShow = customer.addressType || "Home";
                                                    const icon = typeToShow === "Home" ? hous : typeToShow === "Friends/Family" ? friendly : work;

                                                    return (
                                                        <div className="checkout-address-text address-type ">
                                                            <div className="checkout-add-img">
                                                                <img src={icon} alt={typeToShow} />
                                                            </div>
                                                            <h5>{typeToShow}</h5>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {isSelected ? (
                                                <div
                                                    className="checkout-add-edit-img"
                                                    onClick={() => handleEditAddress(customer)}>
                                                    <img src={edit} alt="Edit" />
                                                </div>
                                            ) : (
                                                <div className="checkout-add-edit-cont" ref={optionsRef}>
                                                    <div className="checkout-add-edit-img options" onClick={() => handleShow(customer.id)}>
                                                        <img src={options} alt="Options" />
                                                    </div>

                                                    <div className={`checkout-add-edit-popup ${isOptionsOpen ? "show" : ""}`}>
                                                        <div
                                                            className="edit-option-address edit-address"
                                                            onClick={() => handleEditAddress(customer)}
                                                        >
                                                            <div className="edit-option-img">
                                                                <img src={edit} alt="Edit" className="icon-default" />
                                                                <img src={whitedit} alt="Edit" className="icon-hover" />
                                                            </div>
                                                            <p>Edit</p>
                                                        </div>

                                                        <div
                                                            className="edit-option-address"
                                                            onClick={() => handleSelectCustomer(customer)}
                                                        >
                                                            <div className="edit-option-img">
                                                                <img src={select} alt="Select" className="icon-default" />
                                                                <img src={whiteselect} alt="Select" className="icon-hover" />
                                                            </div>
                                                            <p>Select</p>
                                                        </div>

                                                        <div
                                                            className="edit-option-address"
                                                            onClick={() => handleDeleteCustomer(customer)}
                                                        >
                                                            <div className="edit-option-img">
                                                                <img src={deletebtn} alt="Delete" className="icon-default" />
                                                                <img src={whitedelete} alt="Delete" className="icon-hover" />
                                                            </div>
                                                            <p>Delete</p>
                                                        </div>
                                                    </div>

                                                </div>

                                            )}
                                        </div>
                                        <div className="customer-add-name">
                                            <p>{customer.first_name} {customer.last_name}</p>
                                        </div>
                                        <p className="customer-address-loactions">
                                            {customer.address}
                                            {customer.apartment ? `, ${customer.apartment}` : ""}
                                            <br />
                                            {customer.city}, {customer.state}, {customer.pin}
                                            <br />
                                        </p>
                                        <div className="customer-add-number">{customer.phone}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {showPopup && (
                <div className="popup-overlay checkout-v2 edit-address">
                    <div className="popup-content">
                        <div className="popup-actions-cross btn" onClick={handleClosePopup}><img src={cross} alt="" /></div>
                        <div className="checkout-delivery checkout-h2 checkout-contact checkout-h2">
                            <h2>Add Delivery Address</h2>
                            <div className="delivery-form-container">
                                <div className="select-wrapper">
                                    <label htmlFor="country">Country/Region</label>
                                    <div className="form-group">
                                        <select
                                            id="country"
                                            className="select-box"
                                            value={selectedCountry}
                                            onChange={handleCountryChange}
                                        >
                                            {deliveryZones.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className='checkout-input-wraping'>
                                        <label >First name</label>
                                        <input type="text" placeholder="First name..." required value={deliveryData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            onBlur={validateFields}
                                            className="floating-input" />

                                        {errors.firstName && <div className="error-message"><p>{errors.firstName}</p></div>}
                                    </div>

                                    <div className='checkout-input-wraping'>
                                        <label>Last name</label>
                                        <input type="text" placeholder="Last name..." required value={deliveryData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            onBlur={validateFields}
                                            className="floating-input" />
                                        {errors.lastName && <div className="error-message"><p>{errors.lastName}</p></div>}
                                    </div>
                                </div>

                                <div className='checkout-input-wraping addresss'>
                                    <label>Address</label>
                                    <input type="text" placeholder="Address..." required value={addressQuery}
                                        onBlur={validateFields}
                                        onChange={(e) => handleAddressChange(e.target.value)}
                                        className="floating-input form-input" />
                                    {errors.address && <div className="error-message"><p>{errors.address}</p></div>}
                                    {addressSuggestions.length > 0 && (
                                        <div className="suggestion-box">
                                            <ul className="suggestion-list">
                                                <div className="suggestion-header">
                                                    <span>Suggestions</span>
                                                    <button className="close-button" onClick={() => setAddressSuggestions([])}>×</button>
                                                </div>
                                                {addressSuggestions.map((sug, idx) => (
                                                    <li key={idx} onClick={() => handleAddressSelect(sug)}>
                                                        {sug.display_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="search-icon-address"><img src={searchicon} alt="" /></div>
                                </div>
                                {/* 
                                <div className='checkout-input-wraping'>
                                    <label>Apartment, suite, etc. (optional)</label>
                                    <input type="text" placeholder="" value={deliveryData.apartment}
                                        onChange={(e) => handleInputChange('apartment', e.target.value)}
                                        className="floating-input form-input" />
                                </div> */}
                                <div className='checkout-input-wraping'>
                                    <label >City</label>
                                    <input type="text" placeholder="City..." required value={deliveryData.city}
                                        onBlur={validateFields}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        className="floating-input" />

                                    {errors.city && <div className="error-message"><p>{errors.city}</p></div>}
                                </div>

                                <div className="form-row">

                                    {provinces.length > 0 && (
                                        <div className="checkout-input-wraping">
                                            <div className="form-group">
                                                <label >State</label>
                                                <select id="state" className="select-box" value={selectedProvince} onChange={handleProvinceChange}>
                                                    <option value="">Select State</option>
                                                    {provinces.map((province) => (
                                                        <option key={province.code} value={province.code}>{province.name}</option>
                                                    ))}
                                                </select>
                                                {provinceError && <div className="error-message"><p>{provinceError}</p></div>}
                                            </div>
                                        </div>
                                    )}
                                    <div className='checkout-input-wraping pin-code'>
                                        <label>
                                            {selectedCountry === "IN" ? "PIN code" : "ZIP / Postal code"}
                                        </label>
                                        <input type="text" placeholder="PIN code..." required value={pin} onBlur={validateFields} onChange={handlePinChange} className="floating-input" />
                                        {pinFormatError ? (<div className="error-message"> <p>{pinFormatError}</p></div>
                                        ) : pinProvinceError ? (<div className="error-message"> <p>{pinProvinceError}</p>
                                        </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className='checkout-input-wraping'>
                                    <label>Email</label>
                                    <input type="text" placeholder="Email..." value={deliveryData.email || storedEmail}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="floating-input" />

                                </div>

                                <div className="checkout-mobile-number-add">
                                    <label >Phone</label>
                                    <div className="checkout-add-number-input">
                                        <PhoneInput
                                            defaultCountry="in"
                                            value={deliveryData.phone || storedMobile}
                                            onChange={(phone) => handleInputChange('phone', phone)} />

                                    </div>
                                </div>
                                <div className="checkout-mobile-address-types">
                                    <label>Address Type</label>
                                    <div className="checkout-address-wrapped-sections">
                                        {["Home", "Friends/Family", "Work"].map((type, idx) => {
                                            const icons = { Home: hous, "Friends/Family": friendly, Work: work };
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`checkout-address-text address-type ${selectedAddressType === type ? "selected" : ""}`}
                                                    onClick={() => setSelectedAddressType(type)}
                                                >
                                                    <div className="checkout-add-img">
                                                        <img src={icons[type]} alt={type} />
                                                    </div>
                                                    <h5>{type}</h5>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <button className="btn address" onClick={saveCustomerData}>Save and Continue</button>
                        </div>
                    </div>
                </div>)}

        </>
    );
}
