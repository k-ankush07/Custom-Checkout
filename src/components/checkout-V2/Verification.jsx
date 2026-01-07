import { useState, useRef, useEffect } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import admin from '../../images/user.webp';
import message from '../../images/message.png';
import emailimg from '../../images/emailimg.webp';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function Verification({ onOtpVerified, contactOptions }) {
    const [mobile, setMobile] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [lastOtpSentNumber, setLastOtpSentNumber] = useState("");
    const [lastVerifiedNumber, setLastVerifiedNumber] = useState("");
    const [otpVerifiedOnce, setOtpVerifiedOnce] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [email, setEmail] = useState("");
    const [isMobileFocused, setIsMobileFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);

    const inputRefs = useRef([]);
    const otpTimeout = useRef(null);

    const showPhone = contactOptions.includes("phone") || contactOptions.includes("both");
    const showEmail = contactOptions.includes("email") || contactOptions.includes("both");

    useEffect(() => {
        const storedMobile = localStorage.getItem("mobileNumber") || "";
        const storedEmail = localStorage.getItem("loginEmail") || "";
        setMobile(storedMobile);
        setEmail(storedEmail);
        setLastVerifiedNumber(storedMobile);
    }, []);

    const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

    const handleSendOtp = async ({ mobile, email, otp }) => {
        setGeneratedOtp(otp);
        setShowOtpInput(true);
        setOtp(["", "", "", ""]);
        setOtpVerifiedOnce(false);
        setResendTimer(30);

        try {
            const res = await fetch(`${apiBaseUrl}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile, email, otp }),
            });
            const data = await res.json();
            if (data.success) console.log("OTP sent via", data.method);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (resendTimer > 0) {
            const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [resendTimer]);

    const handleContinue = () => {
        if (!mobile && !email) {
            alert("Enter your mobile number or email!");
            return;
        }

        if ((mobile && mobile === lastVerifiedNumber) || (email && email === localStorage.getItem("loginEmail"))) {
            alert("✅ Already verified! Showing Address.");
            if (onOtpVerified) onOtpVerified();
            return;
        }

        if ((mobile && mobile === lastOtpSentNumber) || (email && email === lastOtpSentNumber)) {
            alert("✅ OTP already sent. Please check your messages.");
            setShowOtpInput(true);
            return;
        }

        const payload = { otp: generateOtp() };
        if (mobile) payload.mobile = mobile;
        if (email) payload.email = email;

        handleSendOtp(payload);

        if (mobile) setLastOtpSentNumber(mobile);
        else if (email) setLastOtpSentNumber(email);
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    useEffect(() => {
        if (
            otp.every((digit) => digit !== "") &&
            generatedOtp !== null &&
            !otpVerifiedOnce
        ) {
            if (otpTimeout.current) clearTimeout(otpTimeout.current);

            otpTimeout.current = setTimeout(() => {
                const enteredOtp = otp.join("");
                if (parseInt(enteredOtp) === generatedOtp) {
                    alert("✅ OTP Verified!");
                    if (mobile) {
                        localStorage.setItem("mobileNumber", mobile);
                        setLastVerifiedNumber(mobile);
                    }
                    if (email) {
                        localStorage.setItem("loginEmail", email);
                    }
                    setLastVerifiedNumber(mobile);
                    setOtpVerifiedOnce(true);
                    if (onOtpVerified) onOtpVerified();
                } else {
                    alert("❌ Incorrect OTP!");
                    setOtp(["", "", "", ""]);
                    inputRefs.current[0].focus();
                }
            }, 2000);
        }

        return () => clearTimeout(otpTimeout.current);
    }, [otp, generatedOtp, mobile, onOtpVerified, otpVerifiedOnce]);

    return (
        <div className="checkout-mobile-wrap">
            {!showOtpInput ? (
                <div className="checkout-mobile-number-otp">
                    <div className="checkout-mobile-number-add">
                        <div className="checkout-mobile-header">
                            <div className="checkout-add-img"><img src={admin} alt="" /></div>
                            <h5>Login to Continue</h5>
                        </div>
                        {showPhone && (
                            <div className="checkout-add-number-input phoneinput">
                                <PhoneInput
                                    defaultCountry="in"
                                    value={mobile}
                                    onFocus={() => setIsMobileFocused(true)}
                                    onBlur={() => setIsMobileFocused(false)}
                                    onChange={(value, country) => {
                                        setMobile(value);
                                        setCountryCode(`+${country.dialCode}`);
                                    }}
                                    inputStyle={{ width: "100%" }}
                                />
                                <label
                                    className={
                                        mobile || countryCode !== "+91" || isMobileFocused ? "floating" : ""
                                    }
                                >
                                    Enter Mobile number
                                </label>
                            </div>
                        )}
                        {showEmail && (
                            <>
                                <div className="checkout-mobile-header email">
                                    <div className="checkout-add-img"><img src={emailimg} alt="" /></div>
                                    <h5>Email Address</h5>
                                </div>
                                <div className="checkout-add-number-input">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setIsEmailFocused(true)}
                                        onBlur={() => setIsEmailFocused(false)}
                                    />
                                    <label className={email || isEmailFocused ? "floating" : ""}>
                                        Enter Your Email Address
                                    </label>
                                </div>
                            </>)}
                    </div>

                    <button className="btn" onClick={handleContinue}>Continue</button>
                </div>
            ) : (
                <div className="otp-section">
                    <div className="checkout-mobile-number-add">
                        <div className="checkout-mobile-header">
                            <div className="checkout-add-img"><img src={admin} alt="" /></div>
                            <h5>OTP Verifiction</h5>
                        </div>
                        <div className="checkout-number-change"><p>OTP Sent via SMS to {mobile} <strong onClick={() => setShowOtpInput(false)} style={{ color: '#000', fontWeight: '500', cursor: "pointer" }}>Change</strong></p></div>
                        <div className="number-otp-add" >
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}

                                />
                            ))}
                        </div>
                        <div className="checkout-number-change">
                            {resendTimer > 0 ? (
                                <div className="checkout-resend-otp">
                                    <p>Didn’t receive the OTP? <strong style={{ color: '#000', fontWeight: '500' }}>Resend in {resendTimer}s</strong></p>
                                    <div className="checkout-sms-otp"><img src={message} alt="" />SMS</div>
                                </div>
                            ) : (
                                <button onClick={handleContinue} className="btn">Resend OTP</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="checkout-privacy-policy">
                <p> By proceeding, I accept the T&C and Privacy Policy Secured by Hubsyntax </p>
            </div>
        </div>
    );
}
