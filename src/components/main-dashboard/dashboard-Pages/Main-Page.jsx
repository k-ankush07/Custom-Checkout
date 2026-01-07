import { useState, useEffect } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import slide from '../../../images/slide.png';
import logout from '../../../images/logout.png';
import SideBar from "./SideBar";
import { useShopify } from "./ShopifyContext";
import blacksummary from '../../../images/black-summary.webp';
import whitesummary from '../../../images/white-sum.webp';
import blackorder from '../../../images/black-order.webp';
import whiteorder from '../../../images/white-order.webp';
import blackabandoned from '../../../images/black-abandoned.webp';
import whiteabandoned from '../../../images/white-abandoned.webp';
import blackcustomers from '../../../images/black-customers.webp';
import whitecustomers from '../../../images/white-customers.webp';
import blacksetup from '../../../images/black-setup.webp';
import whitesetup from '../../../images/white-setup.webp';
import Setting from "./Setting";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const sidebarOptions = [
    { label: "Executive Summary", path: "executive", iconBlack: blacksummary, iconWhite: whitesummary },
    { label: "Orders", path: "orders", iconBlack: blackorder, iconWhite: whiteorder },
    { label: "Abandoned Cart", path: "abandoned", iconBlack: blackabandoned, iconWhite: whiteabandoned },
    { label: "Customers", path: "customers", iconBlack: blackcustomers, iconWhite: whitecustomers },
    { label: "Checkout Setup", path: "checkout-setup", iconBlack: blacksetup, iconWhite: whitesetup },
];

export default function DashBoardPage() {
    const { activeShopIndex, shopifyData, setActiveShopIndex, setShopifyData, } = useShopify();
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("activeTab") || "Executive Summary";
    });

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem("isCollapsed");
        return saved === "true" ? true : false;
    });

    useEffect(() => {
        localStorage.setItem("isCollapsed", isCollapsed);
    }, [isCollapsed]);


    const navigate = useNavigate();
    const location = useLocation();
    const { email: stateEmail } = location.state || {};
    const [email, setEmail] = useState(stateEmail || localStorage.getItem("email") || null);

    useEffect(() => {
        const email = localStorage.getItem("email");
        const shop = localStorage.getItem("shop");
        const token = localStorage.getItem("accessToken");
        const publicCheckoutPages = ["/checkout", "/checkoutv2"];

        if (publicCheckoutPages.includes(location.pathname)) return;

        if (!email) {
            navigate("/login", { replace: true });
        } else if (!shop || !token) {
            navigate("/details", { replace: true });
        }
    }, [navigate, location.pathname]);

    useEffect(() => {
        if (email) {
            localStorage.setItem("email", email);
        }
    }, [email]);

    useEffect(() => {
        const fetchLoginData = async () => {
            try {
                const res = await axios.get(`${apiBaseUrl}/login-data`);
                const storedEmail = localStorage.getItem("email");

                const matchedData = res.data.filter(user => user.email === storedEmail);

                if (matchedData.length > 0) {
                    const shopifyDataArray = await Promise.all(
                        matchedData.map(async ({ shop, accessToken }) => {
                            const shopifyRes = await axios.post(`${apiBaseUrl}/shopify-data`, {
                                shop,
                                accessToken
                            });
                            return shopifyRes.data;
                        })
                    );

                    setShopifyData(shopifyDataArray);
                    localStorage.setItem("shopifyData", JSON.stringify(shopifyDataArray));
                }
            } catch (err) {
                console.error("Error fetching login or Shopify data:", err);
            }
        };

        fetchLoginData();
    }, []);

    useEffect(() => {
        if (shopifyData && shopifyData.length > 0) {
            localStorage.setItem("shopifyData", JSON.stringify(shopifyData));
        }
    }, [shopifyData]);



    return (
        <div className="dsahboard-main-banner">
            <div className="dsahboard-main-banner-wrapping">
                <SideBar
                    sidebarOptions={sidebarOptions}
                    setActiveTab={setActiveTab}
                    isCollapsed={isCollapsed}
                    activeTab={activeTab}
                    setIsCollapsed={setIsCollapsed}
                    slide={slide}
                    shopifyData={shopifyData}
                    logout={logout}
                    activeShopIndex={activeShopIndex}
                    setActiveShopIndex={setActiveShopIndex}
                />
                <div className="dashboard-main-page-right" style={{
                    width: isCollapsed ? "100%" : "87%",
                    transition: "width 0.6s ease",
                }}>
                    <Setting
                        shopifyData={shopifyData}
                        activeShopIndex={activeShopIndex}
                        setActiveShopIndex={setActiveShopIndex}
                    />
                    <div className="dashboard-select-options-text">
                        <Outlet />
                    </div>
                </div>
            </div>

        </div>
    );
}