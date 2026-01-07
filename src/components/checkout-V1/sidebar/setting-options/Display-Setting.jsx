import { useState, useRef } from "react";

export default function DisplaySetting({ storefrontToken, setStorefrontToken, deletebtn1, drop1, handleLogoChange, setLogo,
    hideLogo, setHideLogo, logo, selectedOption, handleSideChange, hideSideLogo, setSideHideLogo, sidelogo, setSideLogo,
    setBgColor, bgColor, handleBgChange, setBgImage, bgImage, checkOutBtnBgColor, setCheckOutBtnBgColor, drop
}) {
    const [dragOverLeft, setDragOverLeft] = useState(false);
    const [dragOverRight, setDragOverRight] = useState(false);
    const [dragOverBg, setDragOverBg] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const fileInputLeftRef = useRef(null);
    const fileInputRightRef = useRef(null);
    const fileInputBgRef = useRef(null);

    const handleRemoveLeft = () => {
        setLogo(null);
        setHideLogo(true);
    };

    const handleRemoveRight = () => {
        setSideLogo(null);
        setSideHideLogo(true);
    };

    const handleRemoveBg = () => {
        setBgImage(null);
    };

    const handleDragOver = (setter) => (e) => {
        e.preventDefault();
        setter(true);
    };

    const handleDragLeave = (setter) => (e) => {
        e.preventDefault();
        setter(false);
    };

    const handleDrop = (setter, changeHandler) => async (e) => {
        e.preventDefault();
        setter(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            await changeHandler({ target: { files: [file] } });
        }
    };

    const handleClickDropzone = (ref) => {
        ref.current.click();
    };

    return (
        <>
            <div
                className={`remove-btn-sidebar drop-btn settings ${isCollapsed ? "rotated" : ""}`}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <img src={drop} alt="Collapse" />
            </div>

            <div className={`setting-options-display review-items-wrap ${isCollapsed ? "hidden" : ""}`}>
                <div className="review-title checkout-side-bar">
                    <label>Store Front API</label>
                    <input
                        type="text"
                        value={storefrontToken}
                        onChange={(e) => setStorefrontToken(e.target.value)}
                        placeholder="Enter Storefront Token"
                    />
                </div>

                <div className="custom-checkbox-wrapper options-setting">
                    <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={hideLogo}
                        onChange={(e) => setHideLogo(e.target.checked)}
                    />
                    <label>Left Header Logo</label>
                </div>

                <div className="review-product checkout-side-bar settings">
                    <label>Upload Image</label>

                    {!logo && (
                        <div className={`dropzone-images ${dragOverLeft ? "drag-over" : ""}`}
                            onDragOver={handleDragOver(setDragOverLeft)}
                            onDragLeave={handleDragLeave(setDragOverLeft)}
                            onDrop={handleDrop(setDragOverLeft, handleLogoChange)}
                            onClick={() => handleClickDropzone(fileInputLeftRef)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="drop-img">
                                <img src={drop1} alt="Drop here" />
                            </div>
                            <p>Drag & Drop your image here or click to select</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                ref={fileInputLeftRef}
                                style={{ display: "none" }}
                            />
                        </div>
                    )}

                    {!hideLogo && logo && (
                        <div className="review-product-wrapped">
                            <div className="preview-wrapper">
                                <img
                                    src={
                                        typeof logo === "string"
                                            ? logo.startsWith("http")
                                                ? logo
                                                : `http://localhost:8000${logo.startsWith("/") ? "" : "/"}${logo}`
                                            : URL.createObjectURL(logo)
                                    }
                                    alt="Logo"
                                    style={{ height: 50 }}
                                    onLoad={typeof logo !== "string" ? () => URL.revokeObjectURL(logo) : undefined}
                                />
                                <div className="remove-btn-sidebar" onClick={handleRemoveLeft}>
                                    <img src={deletebtn1} alt="Remove" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {selectedOption !== "pro" && (
                    <>
                        <div className="custom-checkbox-wrapper options-setting">
                            <input
                                type="checkbox"
                                className="custom-checkbox"
                                checked={hideSideLogo}
                                onChange={(e) => setSideHideLogo(e.target.checked)}
                            />
                            <label>Right Header Logo</label>
                        </div>

                        <div className="review-product checkout-side-bar settings">
                            <label>Upload Image</label>

                            {!sidelogo && (
                                <div
                                    className={`dropzone-images ${dragOverRight ? "drag-over" : ""}`}
                                    onDragOver={handleDragOver(setDragOverRight)}
                                    onDragLeave={handleDragLeave(setDragOverRight)}
                                    onDrop={handleDrop(setDragOverRight, handleSideChange)}
                                    onClick={() => handleClickDropzone(fileInputRightRef)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="drop-img">
                                        <img src={drop1} alt="Drop here" />
                                    </div>
                                    <p>Drag & Drop your image here or click to select</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleSideChange}
                                        ref={fileInputRightRef}
                                        style={{ display: "none" }}
                                    />
                                </div>
                            )}

                            {!hideSideLogo && sidelogo && (
                                <div className="review-product-wrapped">
                                    <div className="preview-wrapper">
                                        <img
                                            src={
                                                typeof sidelogo === "string"
                                                    ? sidelogo.startsWith("http")
                                                        ? sidelogo
                                                        : `http://localhost:8000${sidelogo.startsWith("/") ? "" : "/"}${sidelogo}`
                                                    : URL.createObjectURL(sidelogo)
                                            }
                                            alt="sidelogo"
                                            style={{ height: 50, marginTop: 5 }}
                                            onLoad={typeof sidelogo !== "string" ? () => URL.revokeObjectURL(sidelogo) : undefined}
                                        />
                                        <div className="remove-btn-sidebar" onClick={handleRemoveRight}>
                                            <img src={deletebtn1} alt="Remove" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
                <div className="review-description checkout-side-bar-color">
                    <label>Background Color</label>
                    <div className="review-color-input">
                        <input
                            type="color"
                            value={bgColor || '#ffffff'}
                            onChange={(e) => setBgColor(e.target.value)}
                        />
                        <input
                            type="text"
                            value={bgColor || "#ffffff"}
                            onChange={(e) => setBgColor(e.target.value)}
                        />
                    </div>
                </div>

                <div className="review-product checkout-side-bar settings">
                    <label>Background Image</label>

                    {!bgImage && (
                        <div
                            className={`dropzone-images ${dragOverBg ? "drag-over" : ""}`}
                            onDragOver={handleDragOver(setDragOverBg)}
                            onDragLeave={handleDragLeave(setDragOverBg)}
                            onDrop={handleDrop(setDragOverBg, handleBgChange)}
                            onClick={() => handleClickDropzone(fileInputBgRef)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="drop-img">
                                <img src={drop1} alt="Drop here" />
                            </div>
                            <p>Drag & Drop your image here or click to select</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBgChange}
                                ref={fileInputBgRef}
                                style={{ display: "none" }}
                            />
                        </div>
                    )}

                    {bgImage && (
                        <div className="review-product-wrapped">
                            <div className="preview-wrapper">
                                <img
                                    src={
                                        typeof bgImage === "string"
                                            ? bgImage.startsWith("http")
                                                ? bgImage
                                                : `http://localhost:8000${bgImage.startsWith("/") ? "" : "/"}${bgImage}`
                                            : URL.createObjectURL(bgImage)
                                    }
                                    alt="bgImage"
                                    style={{ height: 50 }}
                                    onLoad={typeof bgImage !== "string" ? () => URL.revokeObjectURL(bgImage) : undefined}
                                />
                                <div className="remove-btn-sidebar" onClick={handleRemoveBg}>
                                    <img src={deletebtn1} alt="Remove" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="review-description checkout-side-bar-color">
                    <label>Button Color</label>
                    <div className="review-color-input">
                        <input
                            type="color" value={checkOutBtnBgColor || '#ffffff'}
                            onChange={(e) => setCheckOutBtnBgColor(e.target.value)}
                        />
                        <input
                            type="text"
                            value={checkOutBtnBgColor || "#ffffff"}
                            onChange={(e) => setCheckOutBtnBgColor(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
