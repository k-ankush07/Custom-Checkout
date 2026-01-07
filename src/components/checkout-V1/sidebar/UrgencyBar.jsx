import { useState, useEffect, useRef } from "react";

export default function UrgencyBar({ selectedbar }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [showBar, setShowBar] = useState(false);
    const [showEndMessage, setShowEndMessage] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!selectedbar) return;

        clearInterval(timerRef.current);

        const localStorageKey = "urgencyBar_" + (selectedbar.btnLink || "default");

        const savedConfig = JSON.parse(localStorage.getItem(localStorageKey + "_config") || "{}");

        const hasConfigChanged =
            savedConfig.days !== selectedbar.days ||
            savedConfig.hours !== selectedbar.hours ||
            savedConfig.minutes !== selectedbar.minutes ||
            savedConfig.seconds !== selectedbar.seconds;

        const isEnded = localStorage.getItem(localStorageKey + "_ended");

        if (isEnded && !hasConfigChanged) {
            setShowBar(false);
            setShowEndMessage(false);
            return;
        }

        let endTime = localStorage.getItem(localStorageKey + "_endTime");

        if (!endTime || hasConfigChanged) {
            const totalSeconds =
                (selectedbar.days || 0) * 86400 +
                (selectedbar.hours || 0) * 3600 +
                (selectedbar.minutes || 0) * 60 +
                (selectedbar.seconds || 0);

            endTime = Date.now() + totalSeconds * 1000;
            localStorage.setItem(localStorageKey + "_endTime", endTime);
            localStorage.setItem(
                localStorageKey + "_config",
                JSON.stringify({
                    days: selectedbar.days || 0,
                    hours: selectedbar.hours || 0,
                    minutes: selectedbar.minutes || 0,
                    seconds: selectedbar.seconds || 0,
                })
            );
            localStorage.removeItem(localStorageKey + "_ended");
        } else {
            endTime = parseInt(endTime, 10);
        }

        setShowBar(true);
        setShowEndMessage(false);

        timerRef.current = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

            const days = Math.floor(remaining / 86400);
            const hours = Math.floor((remaining % 86400) / 3600);
            const minutes = Math.floor((remaining % 3600) / 60);
            const seconds = remaining % 60;

            setTimeLeft({ days, hours, minutes, seconds });

            if (remaining <= 0) {
                clearInterval(timerRef.current);
                setShowBar(false);
                setShowEndMessage(true);
                localStorage.setItem(localStorageKey + "_ended", "true");
                localStorage.removeItem(localStorageKey + "_endTime");
            }
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [selectedbar]);

    if (!selectedbar) return null;

    return (
        <>
            {showBar && (
                <div className="add-reviews-section-urgencyBar sidebar-checkbox">
                    {selectedbar.heading && <h1 style={{textAlign:"left"}}>{selectedbar.heading}</h1>}
                    <div
                        className="add-reviews-section-urgencyBar-wrapp"
                        style={{
                            backgroundColor: selectedbar.backgroundColor || "#ffffff",
                            color: selectedbar.textColor || "#000000",
                            borderColor: selectedbar.borderColor || "#000000",
                            borderStyle: selectedbar.borderStyle || "solid",
                            borderRadius: selectedbar.borderRadius || 4,
                            fontSize: selectedbar.fontSize || 16,
                            padding: selectedbar.padding || 10,
                            textAlign: selectedbar.textAlign || "left",
                            borderWidth: "1px",

                        }}
                    >
                        <div className="urgency-wrapp"> {selectedbar.message && <h3>{selectedbar.message}</h3>}</div>
                        <div className="urgency-wrapp"> {selectedbar.subheading && <p>{selectedbar.subheading}</p>}</div>

                        <div className="urgency-wrapp timer" style={{
                            justifyContent:
                                selectedbar.textAlign === "center"
                                    ? "center"
                                    : selectedbar.textAlign === "right"
                                        ? "flex-end"
                                        : "flex-start",
                        }}>
                            {timeLeft.days > 0 && (
                                <>
                                    <div className="timer-unit">
                                        <span className="timer-value">{timeLeft.days.toString().padStart(2, "0")}</span>
                                        <span className="timer-label">Days</span>
                                    </div>
                                    <span className="timer-colon">:</span>
                                </>
                            )}
                            <div className="timer-unit" >
                                <span className="timer-value">{timeLeft.hours.toString().padStart(2, "0")}</span>
                                <span className="timer-label">Hours</span>
                            </div>
                            <span className="timer-colon">:</span>
                            <div className="timer-unit">
                                <span className="timer-value">{timeLeft.minutes.toString().padStart(2, "0")}</span>
                                <span className="timer-label">Minutes</span>
                            </div>
                            <span className="timer-colon">:</span>
                            <div className="timer-unit">
                                <span className="timer-value">{timeLeft.seconds.toString().padStart(2, "0")}</span>
                                <span className="timer-label">Seconds</span>
                            </div>
                        </div>
                        {selectedbar.btnName  && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        selectedbar.btnPosition === "left"
                                            ? "flex-start"
                                            : selectedbar.btnPosition === "right"
                                                ? "flex-end"
                                                : "center",
                                    marginTop: "10px",
                                }}
                            >
                                <a
                                    href={selectedbar.btnLink}
                                    target={selectedbar.action || "_self"}
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: selectedbar.btnBgColor || "#000",
                                        color: selectedbar.btnColor || "#fff",
                                        borderRadius:selectedbar.btnBorderRadious || 4,
                                        textDecoration: "none",
                                        fontWeight: "bold",
                                        display: selectedbar.btnFullWidth ? "block" : "inline-block",
                                        width: selectedbar.btnFullWidth ? `${selectedbar.btnFullWidth}%` : "auto",
                                        textAlign: selectedbar.btnTextAlign || "center",
                                        fontSize: selectedbar.fontSize || 16,
                                    }}
                                >
                                    {selectedbar.btnName}
                                </a>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {showEndMessage && selectedbar.endmessage && (
                <p style={{ marginTop: "10px", fontWeight: "bold" }}>{selectedbar.endmessage}</p>
            )}
        </>
    );
}
