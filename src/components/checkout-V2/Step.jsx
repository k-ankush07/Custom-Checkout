import { useEffect, useRef } from "react";

export default function Step({ setActiveStep, mobileVerified, activeStep, hasAddress, showThankyouPage }) {
    const switchedOnce = useRef(false);

    useEffect(() => {
        if (hasAddress && !switchedOnce.current && !mobileVerified) {
            setActiveStep("address");
            switchedOnce.current = true;
        }
    }, [hasAddress, mobileVerified, setActiveStep]);

    const handleStepClick = (step) => {
        if (showThankyouPage) return;
        if (step === "mobile") {
            setActiveStep("mobile");
        } else if (step === "address" && !isStepDisabled("address")) {
            setActiveStep("address");
        }
    };

    const getStepColor = (step) => {
        if (showThankyouPage && step === "pay") return "white";
        if (step === "mobile" && mobileVerified && activeStep !== "mobile") return "white";
        if (step === "address" && hasAddress && activeStep !== "mobile") return "white";
        if (step === activeStep) return "#000";
        return "gray";
    };

    const isStepDisabled = (step) => {
        if (showThankyouPage && (step === "mobile" || step === "address")) return true;
        if (step === "address" && (activeStep === "mobile" && !hasAddress && !mobileVerified)) return true;
        if (step === "pay" || (step === "address" && activeStep === "mobile")) return true;
        return false;
    };

    const getCursor = (step) => (isStepDisabled(step) ? "default" : "pointer");

    const getStepClass = (step) => {
        const color = getStepColor(step);
        return color === "white" ? "step-completed" : "";
    };

    return (
        <div className="steps-checkout">
            <div>
                <span
                    onClick={() => !isStepDisabled("mobile") && handleStepClick("mobile")}
                    className={getStepClass("mobile")}
                    style={{
                        color: getStepColor("mobile"),
                        cursor: getCursor("mobile"),
                        opacity: isStepDisabled("mobile") ? 0.5 : 1,
                    }}
                >
                    Contact
                </span>

            </div>
            <div>
                <span
                    onClick={() => !isStepDisabled("address") && handleStepClick("address")}
                    className={getStepClass("address")}
                    style={{
                        color: getStepColor("address"),
                        opacity: isStepDisabled("address") ? 0.5 : 1,
                        cursor: getCursor("address"),
                    }}
                >
                    Address
                </span>

            </div>
            <div>
                <span
                    className={getStepClass("pay")}

                    style={{
                        color: getStepColor("pay"),
                        opacity: isStepDisabled("pay") ? 0.5 : 1,
                        cursor: getCursor("pay"),
                    }}
                >
                    Payment
                </span>
            </div>
        </div>
    );
}
