import { useState, useEffect } from "react";

export default function ContactSetting({ contactOptions, setContactOptions, drop }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const options = [
        { label: "Phone Number", value: "phone" },
        { label: "Email ID", value: "email" },
        { label: "Both (Phone Number & Email ID)", value: "both" },
    ];

    const handleToggle = (value) => {
        setContactOptions([value]);
    };

    useEffect(() => {
        if (contactOptions.length === 0) {
            setContactOptions(["phone"]);
        }
    }, [contactOptions, setContactOptions]);

    return (
        <div className="contact-setting-wrapper">
            <div
                className={`remove-btn-sidebar drop-btn settings ${isCollapsed ? "rotated" : ""}`}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <img src={drop} alt="Collapse" />
            </div>

            {!isCollapsed && (
                <div className="setting-options-display review-items-wrap">
                    <label>Choose Option</label>
                    <div className="custom-checkbox-wrapper-options-setting-contact">
                        {options.map((option) => (
                            <div className="custom-checkbox-options-contacts" key={option.value}>
                                <label>
                                    <input
                                        type="checkbox"
                                        className="custom-checkbox"
                                        checked={contactOptions.includes(option.value)}
                                        onChange={() => handleToggle(option.value)}
                                    />
                                    <p>{option.label}</p>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
