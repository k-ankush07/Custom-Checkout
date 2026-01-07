import { useState, useEffect } from "react";
import Frame from '../../../../images/Frame 170.png';
import logoin from '../../../../images/logoin-1.png';
import SettingAccount from "./Setting-Account";
import SettingSubscription from "./Setting-Subscription";
import SettingStore from "./Setting-Store";
import SettingPayment from "./Setting-Payment";
import SettingMethod from "./Setting-Payement-method";
import blackAccount from '../../../../images/black-account.webp';
import whiteAccount from '../../../../images/white-account.webp';
import blackSubscription from '../../../../images/black-Subscription.webp';
import whiteSubscription from '../../../../images/white-Subscription.webp';
import blackStore from '../../../../images/black-Store.png';
import whiteStore from '../../../../images/white-Store.png';
import blackMethods from '../../../../images/black-Methods.webp';
import whiteMethods from '../../../../images/white-Methods.webp';
import blackPayment from '../../../../images/black-Payment.webp';
import whitePayment from '../../../../images/white-Payment.webp';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function SettingDashBoard() {
    const [activeTab, setActiveTab] = useState("Account");
    const [isCompact, setIsCompact] = useState(false);

        useEffect(() => {
        const handleResize = () => {
            setIsCompact(window.innerWidth <= 700);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menuItems = [
        { name: "Account", black: blackAccount, white: whiteAccount },
        { name: "Subscription", black: blackSubscription, white: whiteSubscription },
        { name: "Store Details", black: blackStore, white: whiteStore },
        { name: "Payment", black: blackPayment, white: whitePayment },
        { name: "Payment Methods", black: blackMethods, white: whiteMethods },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "Account":
                return <SettingAccount />;
            case "Subscription":
                return <SettingSubscription
                    paymentData={paymentData}
                    formatDate={formatDate}
                    getEndDate={getEndDate}
                />;
            case "Store Details":
                return <SettingStore />;
            case "Payment":
                return <SettingPayment
                    paymentData={paymentData}
                    formatDate={formatDate}
                    getEndDate={getEndDate}
                    downloadCSV={downloadCSV}
                />;
            case "Payment Methods":
                return <SettingMethod
                    paymentData={paymentData}

                />;
            default:
                return null;
        }
    };

    const shop = localStorage.getItem("shop");
    const email = localStorage.getItem("email");
    const savedPaymentData = localStorage.getItem("paymentData");
    const [paymentData, setPaymentData] = useState(savedPaymentData ? JSON.parse(savedPaymentData) : null);

    useEffect(() => {
        const fetchPaymentData = async () => {
            if (!shop && !email) return;
            try {
                const params = new URLSearchParams();
                if (shop) params.append("shop", shop);
                if (email) params.append("email", email);
                const response = await fetch(`${apiBaseUrl}/payment-data?${params.toString()}`);
                const data = await response.json();
                const firstSubscription = data[0] || null;
                setPaymentData(firstSubscription);

                if (firstSubscription) {
                    localStorage.setItem("paymentData", JSON.stringify(firstSubscription));
                }
            } catch (error) {
                console.error("Error fetching payment data:", error);
            }
        };

        fetchPaymentData();
    }, [shop, email]);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const getEndDate = (subscription) => {
        if (!subscription) return "-";
        if (subscription.trial_start) {
            const trialEnd = new Date(subscription.trial_start);
            trialEnd.setDate(trialEnd.getDate() + 3);
            return trialEnd.toLocaleDateString();
        } else if (subscription.start_date) {
            const start = new Date(subscription.start_date);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            return end.toLocaleDateString();
        }
        return "-";
    };

    const downloadCSV = () => {
        if (!paymentData) return;
        const headers = ["Shop", "Email", "Customer ID", "Subscription ID", "Status", "Start Date", "End Date", "Amount", "Card Number", "Expiry"];
        const row = [
            paymentData.shop,
            paymentData.email,
            paymentData.customer_id,
            paymentData.subscription_id,
            paymentData.subscription_status,
            formatDate(paymentData.start_date || paymentData.trial_start),
            getEndDate(paymentData),
            `$${paymentData.amount || "0.00"}`,
            paymentData.card_number || "-",
            paymentData.expiry || "-"
        ];
        const csvContent = [headers, row]
            .map(e => e.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "subscription_details.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="checkout-page-setting-section" style={{ display: "flex", minHeight: "80vh" }}>
            <div className="checkout-sidebar wrap-setting"style={{
                    width: isCompact ? "83px" : "325px", 
                    transition: "width 0.3s ease"
                }}>
                <div className= {isCompact? "dashboard-logo-isCompact" : "dashboard-logo"}>
                     <img
                        src={isCompact ? logoin : Frame}
                        alt="Logo"/>
                </div>
                <div className="menu-options">
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            className={`dashboard-option menu-item ${activeTab === item.name ? "active" : ""}`}
                            onClick={() => setActiveTab(item.name)}
                            style={{ cursor: "pointer", padding: "10px", display: "flex", alignItems: "center" }}
                        >
                            <div className={`checkout-img ${activeTab === item.name ? "active" : ""}`}>
                                <img
                                    src={activeTab === item.name ? item.white : item.black}
                                    alt={item.name}
                                />
                            </div>
                            {!isCompact && <p>{item.name}</p>}
                        </div>
                    ))}
                </div>
            </div>
            <div className="checkout-content">
                {renderContent()}
            </div>
        </div>
    );
}
