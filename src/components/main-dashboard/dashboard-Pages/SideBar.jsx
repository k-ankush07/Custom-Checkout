import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Frame from '../../../images/Frame 170.png';
import mingcute_down from '../../../images/rightarrow.png';
import logoin from '../../../images/logoin-1.png';

export default function SideBar({ sidebarOptions, isCollapsed,
    setIsCollapsed, slide, shopifyData, logout, activeShopIndex, setActiveShopIndex
}) {
    const location = useLocation();
    const [selectedOption, setSelectedOption] = useState(() => {
        const saved = localStorage.getItem("selectedOption");
        return saved || "executive";
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const pathMap = {
                "checkoutv2": "checkout-setup",
                "checkout": "checkout-setup",
                "checkout-setup": "checkout-setup",
                "executive": "executive",
                "orders": "orders",
                "abandoned": "abandoned",
                "customers": "customers",
            };

            const expandPaths = ["checkout-setup", "executive", "orders", "abandoned", "customers"];
            const currentPath = location.pathname.split("/").pop();
            const mappedPath = pathMap[currentPath] || currentPath;

            if (sidebarOptions.some(opt => opt.path === mappedPath)) {
                setSelectedOption(mappedPath);
                localStorage.setItem("selectedOption", mappedPath);
            } else {
                const saved = localStorage.getItem("selectedOption") || "executive";
                setSelectedOption(saved);
                localStorage.setItem("selectedOption", saved);
            }

            if (width <= 700) {
                setIsCollapsed(true);
            } else {
                const isOrderDetail = /^\/dashboard\/(orders|abandoned|customers)\/\d+$/i.test(location.pathname);
                if (isOrderDetail) {
                    setIsCollapsed(false);
                } else {
                    setIsCollapsed(!expandPaths.includes(mappedPath));
                }
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [location.pathname, sidebarOptions, setIsCollapsed]);

    useEffect(() => {
        if (shopifyData.length > 0) {
            const shopName = shopifyData[activeShopIndex]?.shop?.name || "";
            const shopEmail = shopifyData[activeShopIndex]?.shop?.email || "";

            localStorage.setItem("activeShopName", shopName);
            localStorage.setItem("activeShopEmail", shopEmail);
        }
    }, [activeShopIndex, shopifyData]);

    const handleShopChange = (e) => {
        const index = Number(e.target.value);
        setActiveShopIndex(index);
        localStorage.setItem("activeShopIndex", index);
        const shopName = shopifyData[index]?.shop?.name || "";
        const shopEmail = shopifyData[index]?.shop?.email || "";
        localStorage.setItem("activeShopName", shopName);
        localStorage.setItem("activeShopEmail", shopEmail);
    };

    const [showSelector, setShowSelector] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 700) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setIsCollapsed]);

    useEffect(() => {
        if (location.pathname === "/dashboard/checkout" || location.pathname === "/dashboard/checkoutv2") {
            setIsCollapsed(true);
        }
    }, [location.pathname, setIsCollapsed]);

    return (
        <div className="dashboard-side-bar" style={{
            width: isCollapsed ? "85px" : "324px",
            transition: "width 0.6s ease",
        }}>
            <div className="dashboard-side-bar-sections">
                <div className={isCollapsed ? "dashboard-logo-collapsed" : "dashboard-logo"}>
                    <img src={isCollapsed ? logoin : Frame} alt="Logo" /></div>
                <div className="dashboard-side-bar-options">
                    {sidebarOptions.map((opt) => {
                        const isActive = selectedOption === opt.path;
                        return (
                            <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                                <NavLink
                                    key={opt.label}
                                    to={`/dashboard/${opt.path}`}
                                    className={`dashboard-option ${isActive ? "active" : ""}`}
                                    style={{
                                        textAlign: isCollapsed ? "center" : "left",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: isCollapsed ? "center" : "flex-start",
                                        padding: isCollapsed ? "0px 0px" : "8px 13px",
                                        margin: isCollapsed ? "10px 0px" : "0 0 5px 0",
                                    }}
                                    onClick={() => setSelectedOption(opt.path)}
                                >
                                    <div className={`checkout-img ${isActive ? "active" : ""}`}>
                                        <img src={isActive ? opt.iconWhite : opt.iconBlack} alt={opt.label} />
                                    </div>
                                    {!isCollapsed && <p>{opt.label}</p>}
                                </NavLink>
                            </div>
                        );
                    })}
                </div>
                {/* <div className="dashboard-btn-slide" onClick={() => setIsCollapsed(!isCollapsed)}>
                    <img src={slide} alt="Toggle Sidebar" />
                </div> */}

                <div className={`dashboard-login-details ${isCollapsed ? "collapsed" : ""}`}>
                    {shopifyData.length > 0 && (
                        <>
                            {isCollapsed && (<div className="dashboard-logo-placeholder">
                                {shopifyData[activeShopIndex]?.shop?.name
                                    ? shopifyData[activeShopIndex].shop.name
                                        .split(" ")
                                        .map(word => word.charAt(0))
                                        .join("")
                                        .toUpperCase()
                                    : ""}
                            </div>)}

                            {!isCollapsed && (
                                <>
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
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
