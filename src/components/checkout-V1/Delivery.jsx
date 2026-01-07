import { useState, useEffect } from "react";

export default function Delivery({ handleInputChange, deliveryData, showNumber, handleNumber, shipping, selectedCountry,
    setSelectedCountry, selectedProvince, setSelectedProvince, pin, setPin, errors, validateFields, handleCountryChange,
    provinceError, setProvinceError, pinFormatError, setPinFormatError, pinProvinceError, setPinProvinceError, cartData,
    setAddressSuggestions, addressSuggestions, setAddressQuery, addressQuery, searchicon,
}) {
    const deliveryZones = shipping || [];
    const [provinces, setProvinces] = useState([]);
    const [pinTouched, setPinTouched] = useState(false);

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
        if (pin && selectedCountry && provinces.length > 0) {
            setPinTouched(true);
        }
    }, [pin, selectedCountry, provinces]);

    useEffect(() => {
        setPinProvinceError("");
        setPinFormatError("");
    }, []);

    useEffect(() => {
        if (!pinTouched || pin.length === 0) return;

        const handler = setTimeout(async () => {
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
        }, 500);

        return () => clearTimeout(handler);
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
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=
                ${encodeURIComponent(value)}&addressdetails=1&limit=5${countryParam}`);
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
        handleInputChange("address", address.display_name);
        setAddressQuery(address.display_name);
        setAddressSuggestions([]);

        const addressInfo = address.address;
        const city = addressInfo.city || addressInfo.town || addressInfo.village || "";
        handleInputChange("city", city);

        if (addressInfo.postcode) setPin(addressInfo.postcode);
        if (addressInfo.state && provinces.length > 0) {
            const matchedProvince = provinces.find(p => p.name.toLowerCase() === addressInfo.state.toLowerCase());
            if (matchedProvince) {
                setSelectedProvince(matchedProvince.code);
                setProvinceError("");
            }
        }
    };

    return (
        <div className="checkout-delivery checkout-h2 checkout-contact checkout-h2">
            <h2>Delivery</h2>
            <div className="delivery-form-container">
                <div className="select-wrapper">
                    <div className="form-group">
                        <label htmlFor="country" className="select-label">Country/Region</label>
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
                        <input type="text" placeholder="" required value={deliveryData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            onBlur={validateFields}
                            className="floating-input" />
                        <label className="floating-label">First name (optional)</label>
                        {errors.firstName && <div className="error-message"><p>{errors.firstName}</p></div>}
                    </div>

                    <div className='checkout-input-wraping'>
                        <input type="text" placeholder="" required value={deliveryData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            onBlur={validateFields}
                            className="floating-input" />
                        <label className="floating-label">Last name</label>
                        {errors.lastName && <div className="error-message"><p>{errors.lastName}</p></div>}
                    </div>
                </div>

                <div className='checkout-input-wraping addresss'>
                    <input type="text" placeholder="" required value={addressQuery}
                        onBlur={validateFields}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        className="floating-input form-input" />
                    <label className="floating-label">Address</label>
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

                <div className='checkout-input-wraping'>
                    <input type="text" placeholder="" value={deliveryData.apartment}
                        onChange={(e) => handleInputChange('apartment', e.target.value)}
                        className="floating-input form-input" />
                    <label className="floating-label">Apartment, suite, etc. (optional)</label>
                </div>

                <div className="form-row">
                    <div className='checkout-input-wraping'>
                        <input type="text" placeholder="" required value={deliveryData.city}
                            onBlur={validateFields}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="floating-input" />
                        <label className="floating-label">City</label>
                        {errors.city && <div className="error-message"><p>{errors.city}</p></div>}
                    </div>

                    {provinces.length > 0 && (
                        <div className="checkout-input-wraping">
                            <div className="form-group">
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
                        <input type="text" placeholder="" required value={pin} onBlur={validateFields} onChange={handlePinChange} className="floating-input" />
                        <label className="floating-label">
                            {selectedCountry === "IN" ? "PIN code" : "ZIP / Postal code"}
                        </label>
                        {pinFormatError ? (<div className="error-message"> <p>{pinFormatError}</p></div>
                        ) : pinProvinceError ? (<div className="error-message"> <p>{pinProvinceError}</p>
                        </div>
                        ) : null}
                    </div>
                </div>

                <div className='checkout-input-wraping'>
                    <input type="text" placeholder="" value={deliveryData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="floating-input phone" />
                    <label className="floating-label">Phone (optional)</label>
                </div>

                {/* <div className="custom-checkbox-number-wrpaed offers">
                    <div className={`custom-checkbox-wrapper ${showNumber ? 'open' : 'hidden'}`}>
                        <label className="custom-checkbox-label custom">
                            <input type="checkbox" className="custom-checkbox" onChange={handleNumber} checked={showNumber} />
                            <span className="checkbox-text">Text me with news and offers</span>
                        </label>
                        <div className={`checkout-page-billing-address-custom ${showNumber ? "visible" : "hidden"}`}>
                            <div className="checkout-page-input-field-custom address">
                                <div className='checkout-input-wraping'>
                                    <input type="text" placeholder="" required className="floating-input form-input last-input" />
                                    <label className="floating-label input-label-custom">Mobile phone number</label>
                                </div>
                                <p>
                                    By signing up via text, you agree to receive recurring automated marketing messages... Msg & data rates may apply.
                                </p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}