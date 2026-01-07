import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import whiteStore from '../../../../images/white-Store.png';
import { useShopify } from "../ShopifyContext";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function SettingStore() {
    const { shopifyData, shop, setActiveShopIndex, setShopifyData, } = useShopify();
    const [loginData, setLoginData] = useState(() => {
        const saved = localStorage.getItem("loginData");
        return saved ? JSON.parse(saved) : null;
    });

    const [allLoginData, setAllLoginData] = useState(() => {
        const saved = localStorage.getItem("allLoginData");
        return saved ? JSON.parse(saved) : [];
    });

    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem("isCollapsed");
        return saved === "true" ? true : false;
    });

    const [loading, setLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [addStoreLoading, setAddStoreLoading] = useState(false);

    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    useEffect(() => {
        const fetchLoginData = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/login-data`);

                const matchedData = response.data.find(
                    item => item.shop === shop && item.email === email
                );
                setLoginData(matchedData || null);
                localStorage.setItem("loginData", JSON.stringify(matchedData || null));

                const matchedLogins = response.data.filter(item =>
                    shopifyData.some(shopItem => shopItem.shop.domain === item.shop) &&
                    item.email === email
                );
                setAllLoginData(matchedLogins);
                localStorage.setItem("allLoginData", JSON.stringify(matchedLogins));

            } catch (error) {
                console.error("Error fetching login data:", error);
            }
        };

        fetchLoginData();
    }, [shop, email, shopifyData]);

    const handleAddStore = () => {
        setAddStoreLoading(true);
        setTimeout(() => {
            setAddStoreLoading(false);
            navigate("/details", { state: { resetStep: true } });
        }, 3000);
    };

    const handleLogout = () => {
        setLogoutLoading(true);
        setTimeout(() => {
            localStorage.removeItem("email");
            localStorage.removeItem("shop");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("shopifyData");
            localStorage.removeItem("activeShopIndex");
            localStorage.removeItem("activeShopName");
            localStorage.removeItem("activeShopEmail");
            localStorage.removeItem("activeTab");
            localStorage.removeItem("selectedOption");
            localStorage.removeItem("isCollapsed");

            setShopifyData([]);
            setActiveShopIndex(0);
            setIsCollapsed(false);

            navigate("/login", { replace: true });
            setLogoutLoading(false);
        }, 3000);
    };

    const handleEditToken = async (shop, email) => {
        const newToken = prompt("Enter new access token:");
        if (!newToken) return;

        setLoading(true);
        try {

            const checkRes = await axios.post(`${apiBaseUrl}/check-shopify`, {
                storeUrl: shop,
                accessToken: newToken,
            });

            if (!checkRes.data.success) {
                alert("❌ Invalid access token. Update aborted.");
                setLoading(false);
                return;
            }

            const updateRes = await axios.post(`${apiBaseUrl}/update-shopify`, {
                email,
                shop,
                accessToken: newToken,
            });

            alert(updateRes.data.message || "✅ Token updated successfully");
            setLoginData(prev => {
                if (prev?.shop === shop && prev?.email === email) {
                    return { ...prev, accessToken: newToken };
                }
                return prev;
            });

            setAllLoginData(prev =>
                prev.map(item =>
                    item.shop === shop && item.email === email
                        ? { ...item, accessToken: newToken }
                        : item
                )
            );
        } catch (err) {
            console.error("Error during token validation/update:", err);
            alert("❌ Failed to validate or update token");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-setting-wrp">
            <div className="checkout-setting-navgate">
                <p><span>Settings/</span>Store Details</p>
            </div>
            <div className="checkout-setting-webp">
                <div className="checkout-img active account">
                    <img src={whiteStore} alt="" />
                </div>
                <div className="setting-title">
                    <p>Store Details</p>
                </div>
            </div>
            <div className="checkout-setting-account-form">
                <div className="checkout-store-details">
                    <div className="store-details">Store URL : {shop || "-"}</div>
                    <div className="store-details second">Access Token: {loginData?.accessToken || "-"}</div>
                </div>
                <div className="checkout-btn-layout">
                    <div className="btn-wrap store" onClick={!addStoreLoading ? handleAddStore : undefined}>
                        {addStoreLoading ? (
                            <>
                                <i className="fa fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                            </>
                        ) : (
                            "Add Store"
                        )}
                    </div>

                    <div className="btn-wrap logout" onClick={!logoutLoading ? handleLogout : undefined}>
                        {logoutLoading ? (
                            <>
                                <i className="fa fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                            </>
                        ) : (
                            "Logout"
                        )}
                    </div>
                </div>
                <div className="checkout-store-details-shopifyData">
                    {allLoginData.length > 0 ? (
                        allLoginData.map((item, index) => (
                            <div key={index} className="checkout-store-details store-details-block">
                                <div className="store-details">Store URL : {item.shop}</div>
                                <div className="store-access-token">
                                    <div className="store-details second">Access Token : {item.accessToken} </div>
                                    <div
                                        className="token-edit"
                                        onClick={() => handleEditToken(item.shop, item.email)}
                                    >
                                       <p> {loading ? "Updating..." : "Edit"}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="store-details-block">
                            <div className="store-details">Store URL : -</div>
                            <div className="store-details second">Access Token : -</div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
