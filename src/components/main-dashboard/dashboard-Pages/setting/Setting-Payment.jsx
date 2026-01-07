import whitePayment from '../../../../images/white-Payment.webp';
import download from '../../../../images/download.png';
import { useState } from "react";

export default function SettingPayment({ paymentData, formatDate, downloadCSV }) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 3000));

            await downloadCSV();
        } catch (err) {
            console.error("Download error:", err);
            alert("Failed to download CSV.");
        } finally {
            setDownloading(false);
        }
    };
    
    return (
        <div className="checkout-setting-wrp">
            <div className="checkout-setting-navgate">
                <p><span>Settings/</span>Payment</p>
            </div>
            <div className="checkout-setting-webp payment">
                <div className="checkout-img active account">
                    <img src={whitePayment} alt="" />
                </div>
                <div className="setting-title">
                    <p>Payment</p>
                </div>
            </div>
            <div className="setting-title-subtitle">
                <p>Payment History</p>
            </div>
            <div className="checkout-setting-account-form subscription">
                {paymentData ? (
                    <table className="subscription-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Date Of Subscription</th>
                                <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Amount</th>
                                <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Status of Payment</th>
                                <th style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
                                    {formatDate(paymentData.start_date || paymentData.trial_start)}
                                </td>
                                <td style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
                                    ${paymentData.amount ?? "0.00"}
                                </td>
                                <td style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
                                    {paymentData.subscription_status === "active"
                                        ? "Paid "
                                        : paymentData.subscription_status === "trialing"
                                            ? "Free"
                                            : "Free"}
                                </td>
                                <td style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
                                    <div className="downlaod-btn" onClick={handleDownload}>
                                        {downloading ? (
                                            <>
                                                <i className="fa fa-spinner fa-spin" ></i>
                                            </>
                                        ) : (
                                            <img src={download} alt="Download" />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <p>No subscription data available.</p>
                )}
            </div>
        </div>
    );
}
