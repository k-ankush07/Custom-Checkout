import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Google from "./Login-google";
import { useLocation } from "react-router-dom";
import loginImage from '../../images/login-icon.png';
import Vector from '../../images/Vector.png';
import Layer_1 from '../../images/Layer_1.png';
import customer from '../../images/Group 98.png';
import loadingImg from '../../images/loading.gif';
import open from '../../images/open.png';
import close from '../../images/close.png';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [emailExists, setEmailExists] = useState(false);
    const [emailChecked, setEmailChecked] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [passwordResetSent, setPasswordResetSent] = useState(false);
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith("/reset-password")) return;

        const email = localStorage.getItem("email");
        const shop = localStorage.getItem("shop");
        const token = localStorage.getItem("accessToken");

        const publicCheckoutPages = ["/checkout", "/checkoutv2"];

        if (email && shop && token) {
            if (location.pathname === "/login") {
                navigate("/dashboard", { replace: true });
            }
        } else if (email && (!shop || !token)) {
            if (!publicCheckoutPages.includes(location.pathname)) {
                navigate("/details", { replace: true });
            }
        }
    }, [navigate, location]);

    useEffect(() => {
        const isValidEmail = email.includes("@") && email.includes(".");
        if (!isValidEmail) {
            setEmailChecked(false);
            return;
        }

        setCheckingEmail(true);

        const timer = setTimeout(async () => {
            try {
                const response = await axios.post(`${apiBaseUrl}/check-email`, { email });
                setEmailExists(response.data.exists);
                setEmailChecked(true);
            } catch (err) {
                console.error(err);
                setEmailChecked(false);
            } finally {
                setCheckingEmail(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [email]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setLoading(true);

        setTimeout(async () => {
            if (!validatePassword(password)) {
                setFormError("Password does not meet requirements");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${apiBaseUrl}/login-data`);
                const users = response.data;
                const user = users.find(u => u.email === email);
               
                if (user) {
                    if (user.password !== password) {
                        setFormError("Incorrect password");
                        setLoading(false);
                        return;
                    }

                    const shop = user.shop;
                    const token = user.accessToken;

                    if (shop && token) {
                        try {
                            const paymentResponse = await axios.get(`${apiBaseUrl}/payment-data`, { params: { shop, email } });
                            const subscriptions = paymentResponse.data || [];

                            localStorage.setItem("email", email);
                            localStorage.setItem("shop", shop);
                            localStorage.setItem("accessToken", token);

                            const matchedSubscription = subscriptions.find(
                                (sub) => sub.subscription_status === "active" || sub.subscription_status === "trialing"
                            );

                            setLoading(false);

                            if (matchedSubscription) {
                                navigate("/dashboard");
                            } else {
                                setFormError("No active subscription found. Redirecting to payment.");
                                navigate("/payment");
                            }

                        } catch (err) {
                            console.error("Error checking subscription:", err);
                            setFormError("Error checking subscription. Redirecting to payment.");
                            setLoading(false);
                            navigate("/payment");
                        }
                        return;
                    }

                    const loginResponse = await axios.post(`${apiBaseUrl}/login`, { email, password });
                    localStorage.setItem("email", email);
                    setLoading(false);
                    navigate("/details", { state: { email } });

                } else {
                    if (password !== repeatPassword) {
                        setFormError("Passwords do not match");
                        setLoading(false);
                        return;
                    }

                    const signupResponse = await axios.post(`${apiBaseUrl}/signup`, { email, password });
                    localStorage.setItem("email", email);
                    setLoading(false);
                    navigate("/details", { state: { email } });
                }

            } catch (err) {
                console.error(err);
                setFormError(err.response?.data?.message || "Something went wrong");
                setLoading(false);
            }
        }, 2000);
    };

    const handleGoogleLoginSuccess = async (user) => {
        const googleEmail = user.email;
        localStorage.setItem("email", googleEmail);

        try {
            const response = await axios.get(`${apiBaseUrl}/login-data`);
            const users = response.data;
            const existingUser = users.find(u => u.email === googleEmail);

            if (existingUser) {
                const shop = existingUser.shop;
                const token = existingUser.accessToken;

                if (shop && token) {
                    try {
                        const paymentResponse = await axios.get(`${apiBaseUrl}/payment-data`, { params: { shop, email: googleEmail } });
                        const subscriptions = paymentResponse.data || [];

                        localStorage.setItem("shop", shop);
                        localStorage.setItem("accessToken", token);

                        const matchedSubscription = subscriptions.find(
                            (sub) =>
                                sub.subscription_status === "active" || sub.subscription_status === "trialing"
                        );

                        if (matchedSubscription) {
                            navigate("/dashboard");
                        } else {
                            navigate("/payment");
                        }

                    } catch (err) {
                        console.error("Error checking subscription:", err);
                        navigate("/payment");
                    }

                } else {
                    navigate("/details", { state: { email: googleEmail } });
                }

            } else {

                const randomPassword = Math.random().toString(36).slice(-10);

                const signupResponse = await axios.post(`${apiBaseUrl}/signup`, {
                    email: googleEmail,
                    password: randomPassword
                });

                alert(signupResponse.data.message);
                navigate("/details", { state: { email: googleEmail } });
            }

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleForgotPassword = async () => {
        try {
            await axios.post(`${apiBaseUrl}/forgot-password`, { email });
            setPasswordResetSent(true);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };


    return (
        <div className="checkout-login-page">
            <div className="wrapper">
                <div className="checkout-sign-up">
                    <div className="checkout-sign-up-wrapp">
                        <div className="login-page-logo"><h2>CUSTOM CHECKOUT</h2></div>
                        <div className="checkout-page-sign">
                            <form onSubmit={handleSubmit}>
                                <div className="checkout-page-login-h1">
                                    <img src={loginImage} alt="" className="login-img" />
                                    <h1 className="checkout-title">Login/Sign up</h1>
                                </div>
                                <div className="checkout-page-wrapp">
                                    <Google onLogin={handleGoogleLoginSuccess} />
                                    <div className="login-page-lines">
                                        <span className="line"></span>
                                        <span className="or-text"><p>Or</p></span>
                                        <span className="line"></span>
                                    </div>
                                    <div className="login-email-wrapp">
                                        <div className="login-details-input">
                                            <img src={Layer_1} alt="" className="email-img" />
                                            <input
                                                type="email"
                                                value={email}
                                                onKeyDown={handleKeyDown}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="Email"
                                            />
                                        </div>
                                        {checkingEmail && (
                                            <div className="email-loading">
                                                <img src={loadingImg} alt="Loading..." style={{ width: "30px", marginTop: "5px" }} />
                                            </div>
                                        )}
                                    </div>
                                    {emailChecked && (
                                        <>
                                            <div className="login-input-password">
                                                <div className="login-details-input">
                                                    <img src={Vector} alt="" className="pass-img pass" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onKeyDown={handleKeyDown}
                                                        onChange={(e) => {
                                                            setPassword(e.target.value);
                                                            validatePassword(e.target.value);
                                                        }}
                                                        required
                                                        minLength={6}
                                                        placeholder="Password"
                                                    />
                                                    <img
                                                        src={showPassword ? open : close}
                                                        alt="toggle"
                                                        className="toggle-pass-icon"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        style={{ cursor: "pointer", width: "18px", marginLeft: "8px" }}
                                                    />
                                                </div>
                                                <div className="error-login-page">
                                                    {passwordError && (
                                                        <p>{passwordError}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {!emailExists && (
                                                <div className="login-details-input">
                                                    <img src={Vector} alt="" className="pass-img pass" />
                                                    <input
                                                        type={showRepeatPassword ? "text" : "password"}
                                                        value={repeatPassword}
                                                        onKeyDown={handleKeyDown}
                                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                                        required
                                                        minLength={6}
                                                        placeholder="Repeat Password"
                                                    />
                                                    <img
                                                        src={showRepeatPassword ? open : close}
                                                        alt="toggle"
                                                        className="toggle-pass-icon"
                                                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                                        style={{ cursor: "pointer", width: "18px", marginLeft: "8px" }}
                                                    />
                                                </div>
                                            )}
                                            <button className="btn-login log" type="submit" disabled={loading}>
                                                {loading ? <i className="fa fa-spinner fa-spin" aria-hidden="true"></i> : emailExists ? "Log In" : "Sign-Up"}
                                            </button>

                                            {formError && <p className="error-login-page">{formError}</p>}

                                            {emailExists && !passwordResetSent && (
                                                <div className="forget-password" onClick={handleForgotPassword}>
                                                    <p>Forgot Password</p>
                                                </div>
                                            )}
                                            {passwordResetSent && (
                                                <p className="forget-password" style={{ color: "#368517", }}>
                                                    Password reset email sent!
                                                </p>
                                            )}

                                        </>
                                    )}

                                    <div className="checkout-page-customer-list">
                                        <div className="customer-icon"><img src={customer} alt="" /></div>
                                        <p><span style={{ color: "black" }}>13,622+ people</span> started a free trial in the last 7 days</p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="checkout-service">
                        <p>By continuing, you are indicating that you accept our  <span style={{ color: "black", borderBottom: "1px solid #00000029" }}> Terms of Service </span>
                            and our <span style={{ color: "black", borderBottom: "1px solid #00000029" }}> Privacy Policy</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
