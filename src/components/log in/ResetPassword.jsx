import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImage from '../../images/login-icon.png';
import Vector from '../../images/Vector.png';
import open from '../../images/open.png';
import close from '../../images/close.png';
import { useLocation } from "react-router-dom";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function ResetPassword() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const emailFromLink = query.get("email");

    const validatePassword = (pwd) => {
        const strongRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!strongRegex.test(pwd)) {
            setPasswordError(
                "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
            );
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (!validatePassword(newPassword)) return;

        if (newPassword !== confirmNewPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            setTimeout(async () => {
                try {
                    const response = await axios.post(
                        `${apiBaseUrl}/reset-password/${token}`,
                        { password: newPassword }
                    );

                    setPasswordError("");
                    navigate("/login");
                } catch (err) {
                    console.error(err);
                    setPasswordError(err.response?.data?.message || "Something went wrong");
                } finally {
                    setLoading(false);
                }
            }, 2000);
        } catch (err) {
            console.error(err);
            setPasswordError("Something went wrong");
            setLoading(false);
        }
    };


    return (
        <div className="checkout-login-page">
            <div className="wrapper">
                <div className="checkout-sign-up">
                    <div className="checkout-sign-up-wrapp">
                        <div className="login-page-logo"><h2>CUSTOM CHECKOUT</h2></div>
                        <div className="checkout-page-login-h1">
                            <img src={loginImage} alt="" className="login-img" />
                            <h1 className="checkout-title">Reset  password?</h1>
                        </div>
                        <p className="checkout-title">
                            <span style={{ color: "black" }}>{emailFromLink}</span>
                        </p>
                        <div className="checkout-page-wrapp">
                            <form onSubmit={handleReset}>
                                <div className="login-input-password">
                                    <div className="login-details-input reset">
                                        <img src={Vector} alt="" className="pass-img pass" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                validatePassword(e.target.value);
                                            }}
                                            required
                                            placeholder="New password"
                                        />
                                        <img
                                            src={showPassword ? open : close}
                                            alt="toggle password"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ cursor: "pointer", width: "20px", marginLeft: "5px" }}
                                        />
                                    </div>
                                    {passwordError && (
                                        <div className="error-login-page">
                                            {passwordError && (
                                                <p>{passwordError}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="login-details-input">
                                    <img src={Vector} alt="" className="pass-img pass" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        required
                                        placeholder="Confirm Password"
                                    />
                                    <img
                                        src={showConfirmPassword ? open : close}
                                        alt="toggle confirm password"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{ cursor: "pointer", width: "20px", marginLeft: "5px" }}
                                    />
                                </div>

                                <button className="btn-login" type="submit" disabled={loading}>
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
