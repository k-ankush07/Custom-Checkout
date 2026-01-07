import settingIcon from '../../../images/settingIcon.png';
import cross from '../../../images/cross.png';
import { useState } from "react";
import { useLocation } from "react-router-dom";
import SettingDashBoard from './setting/Setting-Dashboard';
import mingcute_down from '../../../images/rightarrow.png';

export default function Setting({ shopifyData, activeShopIndex, setActiveShopIndex }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const location = useLocation();
    const [showSelector, setShowSelector] = useState(false);
    const handleClick = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const handleClose = () => {
        setIsPopupOpen(false);
    }

    const handleShopChange = (e) => {
        const index = Number(e.target.value);
        setActiveShopIndex(index);
        localStorage.setItem("activeShopIndex", index);
        const shopName = shopifyData[index]?.shop?.name || "";
        const shopEmail = shopifyData[index]?.shop?.email || "";
        localStorage.setItem("activeShopName", shopName);
        localStorage.setItem("activeShopEmail", shopEmail);
    };

    const hideSettingsOn = ["/dashboard/checkout", "/dashboard/checkoutv2"];
    const shouldHideSettings = hideSettingsOn.includes(location.pathname);

    if (shouldHideSettings) return null;

    return (
        <div className='setting-option-wrapping'>
            <div className='setting-option-items'>
                <div className='setting-option-change-store'>
                    <div className={`dashboard-login-add ${showSelector ? "expanded" : ""}`}>
                        <div className="login-name">
                            {shopifyData[activeShopIndex]?.shop?.name}
                        </div>
                        <div className="login-email">
                            {shopifyData[activeShopIndex]?.shop?.domain}
                        </div>

                        {shopifyData.length > 1 && (
                            <div
                                className={`store-selector-container ${showSelector ? "show" : ""}`}
                            >
                                <select
                                    value={activeShopIndex}
                                    onChange={handleShopChange}
                                    className="shop-selector"
                                >
                                    {shopifyData.map((shopItem, index) => (
                                        <option key={index} value={index}>
                                            {shopItem.shop.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {shopifyData.length > 1 && (
                        <div
                            className="store-change-options"
                            onClick={() => setShowSelector(!showSelector)}
                        >
                            <img
                                src={mingcute_down} alt=""
                                className={showSelector ? "rotate" : ""} />
                        </div>
                    )}
                </div>
            </div>

            <div className="dashboard-setting-option">

                <div className='dashboard-setting-icon' onClick={handleClick}>
                    <img src={settingIcon} alt="Settings" />
                </div>
            </div>

            <div className={`popup full ${isPopupOpen ? 'show' : ''}`}>
                <div className='close-popup' onClick={handleClose}><img src={cross} alt="" /></div>
                <div className="popup-content dashboard">
                    <SettingDashBoard />
                </div>
            </div>
        </div>
    )
}
