import { useState, useEffect } from "react";
import deletebtn from '../../../images/delete.png';
import crossbtn from '../../../images/crossbtn.webp';
import add from '../../../images/add.webp';
import addicon from '../../../images/addicon.webp';
import deletebtn1 from '../../../images/delete.webp';
import drop from '../../../images/drop.webp';
import block from '../../../images/block.webp';
import drop1 from '../../../images/drop1.webp';
import starimg from '../../../images/star.png';
import pro from '../../../images/pro.webp';
import Setting from "./Setting";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }], ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
    ],
};

const formats = [
    "header", "bold", "italic", "underline", "strike",
    "blockquote", "code-block", "list",
    "bullet", "link", "image",
    "align", "color", "background",
];

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const sectionDisplayNames = {
    urgencyBar: "HurryUp Timer",
    trustBages: "Multicolumn",
    product: "Upsel Products",
    video: "videos",
    richtext: "rich text"
};

export default function Sidebar({ sections, selectedSections, setSelectedSections, shop, products, selectedProducts,
    setSelectedProducts, reviewInputs, setReviewInputs, productStyle, setProductStyle, videoInputs, setVideoInputs,
    setSectionPositions, sectionPositions, gridItemsPerRow, setGridItemsPerRow, selectedbar, setSelectedBar,
    selectedbages, setSelectedbages, setBagesStyle, bagesStyle, gridPerSlide, setGridPerSlide, activeSetting, setActiveSetting,
    setActiveTab, saveData, setSaveData, stripePublishableKey, setStripePublishableKey, stripeSecretKey, setStripeSecretKey,
    setLogo, logo, setHideLogo, hideLogo, setSideHideLogo, hideSideLogo, setSideLogo, sidelogo, bgColor, setBgColor,
    setBgImage, bgImage, activeTab, sectionsWithImagesBlack, sectionsWithImagesWhite, productHeading, setProductHeading,
    richInputs, setRichInputs, setRazorpayID, razorpayID, razorpayKey, setRazorpayKey, storefrontToken, setStorefrontToken,
    setCheckOutBtnBgColor, checkOutBtnBgColor, paymentOptions, CheckoutPaymentOtions, setCheckoutPaymentOtions, setContactOptions,
    contactOptions, setHiddenSections, hiddenSections, sideBarSection, selectedOption, setSideBarSection, setShowProductPopup, showProductPopup,
    accessToken
}) {

    const [collapsedReviews, setCollapsedReviews] = useState([]);
    const [collapsedVideos, setCollapsedVideos] = useState([]);
    const [collapsedBages, setCollapsedBages] = useState([]);

    const handleAddSection = (sectionName) => {
        setSelectedSections(prev => {
            const isSelected = prev.includes(sectionName);
            const updatedSections = isSelected
                ? prev.filter(sec => sec !== sectionName)
                : [...prev, sectionName];

            if (!isSelected) {
                setHiddenSections(prevHidden =>
                    prevHidden.includes(sectionName)
                        ? prevHidden
                        : [...prevHidden, sectionName]
                );
                setHiddenSections(prevHidden =>
                    prevHidden.filter(s => s !== sectionName)
                );
            }

            return updatedSections;
        });
    };

    const isVisible = (section) =>
        selectedSections.includes(section) && !hiddenSections.includes(section);

    const handleReviewChange = (index, field, value) => {
        const updated = [...reviewInputs];
        updated[index] = { ...updated[index], [field]: value };
        setReviewInputs(updated);
    };

    const handleRemoveReview = (index) => {
        const updated = [...reviewInputs];
        updated.splice(index, 1);
        setReviewInputs(updated);
        // sendCustomData(updated);
    };

    const handleStyleChange = (e) => {
        setProductStyle(e.target.value);
    };

    const handleProductSelect = (product) => {
        let updatedProducts;
        const isAlreadySelected = selectedProducts.some(p => p.id === product.id);

        if (isAlreadySelected) {
            updatedProducts = selectedProducts.filter(p => p.id !== product.id);
        } else {
            updatedProducts = [...selectedProducts, product];
        }

        setSelectedProducts(updatedProducts);

        if (!selectedSections.includes('product')) {
            setSelectedSections([...selectedSections, 'product']);
        }
    };

    const handleAddVideo = () => setVideoInputs(prev => ({ ...prev, videos: [...prev.videos, ""] }));

    const handleVideoChange = (index, value) => setVideoInputs(prev => {
        const updatedVideos = [...prev.videos];
        updatedVideos[index] = value;
        return { ...prev, videos: updatedVideos };
    });

    const handleRemoveVideo = (index) => setVideoInputs(prev => {
        const updatedVideos = [...prev.videos];
        updatedVideos.splice(index, 1);
        return { ...prev, videos: updatedVideos };
    });

    useEffect(() => {
        if (selectedSections.includes("review") && reviewInputs.length === 0) {
            setReviewInputs([
                {
                    productImage: "https://images.pexels.com/photos/7774247/pexels-photo-7774247.jpeg",
                    rating: 5,
                    title: "Review Title",
                    description:
                        "Thankfully, you don’t have to rely on the native option to add Google reviews to website builders, as our free Google reviews widget includes a few simple steps.",
                    name: "John Doe",
                    file: "https://images.pexels.com/photos/3205588/pexels-photo-3205588.jpeg",
                    imageStyle: "circle",
                    display: "slider",
                    itemsPerRow: 2,
                    heading: 'Review'
                }
            ]);
        }

        if (selectedSections.includes("video") && (!videoInputs || videoInputs.videos?.length === 0)) {
            setVideoInputs(prev => ({ ...prev, videos: [""] }));
        }
        if (selectedSections.includes("trustBages") && selectedbages.length === 0) {
            setSelectedbages([{
                title: "Bages Title",
                description: "Review Section Inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results.",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ7LKoE92zIcgdcmfNHp4EZMtnDctSZSITQw&s"
            }]);
        }

        if (selectedSections.includes("urgencyBar")) {
            const defaultUrgencyBar = {
                message: "Checkout while item is available",
                minutes: 5,
                endmessage: "Thank you!",
                textColor: "#000000",
                backgroundColor: "#ffffff",
                borderColor: "#000000",
                borderStyle: "solid",
                borderRadius: 4,
                fontSize: 16,
                padding: 10,
                textAlign: "left"
            };

            setSelectedBar(prev => ({
                ...defaultUrgencyBar,
                ...prev
            }));
        }

    }, [selectedSections, reviewInputs.length, videoInputs, selectedbages.length]);

    useEffect(() => {
        if (saveData) {
            sendCustomData();
            setSaveData(false);
        }
    }, [saveData]);

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/upload-file', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('File upload failed');
        const data = await response.json();
        return data.url;
    };

    const email = localStorage.getItem("email");
    const token = accessToken || localStorage.getItem("accessToken");

    const sendCustomData = async (updatedReviews = reviewInputs) => {
        try {
            const reviewsWithUrls = await Promise.all(
                updatedReviews.map(async (review) => {
                    let uploadedFileUrl = review.file;
                    let uploadedProductImageUrl = review.productImage;

                    if (review.file && typeof review.file !== 'string') {
                        uploadedFileUrl = await uploadFile(review.file);
                    }

                    if (review.productImage && typeof review.productImage !== 'string') {
                        uploadedProductImageUrl = await uploadFile(review.productImage);
                    }

                    return {
                        ...review,
                        file: uploadedFileUrl,
                        productImage: uploadedProductImageUrl,
                    };
                })
            );

            const payload = {
                shop,
                email,
                accessToken: token,
                options: selectedSections,
                sectionPositions,
                storefrontToken,
                logo,
                sidelogo,
                stripePublishableKey,
                stripeSecretKey,
                razorpayID,
                razorpayKey,
                checkOutBtnBgColor,
                CheckoutPaymentOtions,
                reviews: reviewsWithUrls.filter(r => {
                    const ratingNum = Number(r.rating);
                    return !isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5;
                }),

                videos: {
                    list: videoInputs.videos,
                    display: videoInputs.display,
                    heading: videoInputs.heading
                },
                products: selectedProducts.map(p => p.id),
                urgencyBar: selectedbar || {},
                trustBages: selectedbages || {},
                richText: richInputs || [],
                bgColor: bgColor || "#ffffff",
                bgImage: bgImage || "",
                contactOptions: contactOptions,
                styles: {
                    productStyle: productStyle, itemsPerRow: videoInputs.itemsPerRow,
                    bagesStyle: bagesStyle, gridPerSlide: gridPerSlide,
                    hideLogo: hideLogo, hideSideLogo: hideSideLogo, sideBarSection: sideBarSection,
                    selectedOption: selectedOption, gridItemsPerRow: gridItemsPerRow,
                    productHeading: productHeading,
                },
            };

            console.log("🟡 Payload being sent:", JSON.stringify(payload, null, 2));

            const apiUrl = selectedOption === "pro"
                ? `${apiBaseUrl}/checkoutV2`
                : activeTab === "thankyou"
                    ? `${apiBaseUrl}/thanku-data`
                    : `${apiBaseUrl}/custom-data`;

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log("📤 Sent:", data);
        } catch (error) {
            console.error("❌ Error sending data:", error);
        }
    };

    const handleSectionPositionChange = (section, position) => {
        setSectionPositions(prev => ({
            ...prev,
            [section]: position
        }));
    };

    const handleClick = () => {
        setSideBarSection(prev => !prev);
    };

    const toggleCollapse = (index) => {
        setCollapsedReviews((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const toggleVideoCollapse = (index) => {
        setCollapsedVideos((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const toggleBagesCollapse = (index) => {
        setCollapsedBages((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const getOptions = () => {
        if (activeTab === "thankyou") {
            return (
                <>
                    <option value="upperGraph">Upper Graph</option>
                    <option value="lowerGraph">Lower Graph</option>
                    <option value="lastBilling">Under Graph</option>
                </>
            );
        } else if (selectedOption === "pro") {
            return (
                <>
                    <option value="aboveNumber">Above Number</option>
                    <option value="underNumber">Under Number</option>
                    <option value="aboveDiscount">Above Discount</option>
                    <option value="aboveShipping">Above Shipping</option>
                    <option value="underShipping">Under Shipping</option>
                    <option value="aboveDelivery">Above Delivery</option>
                    <option value="underDelivery">Under Delivery</option>
                    <option value="underPayment">Under Payment</option>

                </>
            );
        } else {
            return (
                <>
                    <option value="aboveProduct">Above Product Item</option>
                    <option value="aboveContent">Above Content</option>
                    <option value="aboveShipping">Above Shipping</option>
                    <option value="underShipping">Under Shipping</option>
                    <option value="aboveDelivery">Above Delivery</option>
                    <option value="underPaynow">Under Pay Now</option>
                    <option value="totalPrice">Above Total Price</option>
                    <option value="last">Under Total Price</option>

                </>
            );
        }
    };

    return (
        <div className="checkout-page-side-bar">
            <div className="checkout-contact checkout-h3 sidebar settings">
                <div className={`checkout-title-h3 checkout ${activeSetting === "setting" ? "active" : ""}`}
                    onClick={() => { setActiveSetting("setting"); setActiveTab(''); }}>
                    <h3>Settings</h3>
                </div>
                <div className={`checkout-title-h3 checkout ${activeSetting === "help" ? "active" : ""}`}
                    onClick={() => { setActiveSetting("help"); setActiveTab(''); }}>
                    <h3>Help</h3>
                </div>
            </div>
            <div className="checkout-page-header-section">
                <div style={{ position: 'relative' }}>
                    {activeSetting === 'setting' && activeTab !== 'thankyou' && (<Setting
                        setStorefrontToken={setStorefrontToken}
                        storefrontToken={storefrontToken}
                        stripePublishableKey={stripePublishableKey}
                        setStripePublishableKey={setStripePublishableKey}
                        stripeSecretKey={stripeSecretKey}
                        setStripeSecretKey={setStripeSecretKey}
                        razorpayID={razorpayID}
                        setRazorpayID={setRazorpayID}
                        setRazorpayKey={setRazorpayKey}
                        razorpayKey={razorpayKey}
                        uploadFile={uploadFile}
                        setLogo={setLogo}
                        setHideLogo={setHideLogo}
                        hideLogo={hideLogo}
                        logo={logo}
                        setSideHideLogo={setSideHideLogo}
                        hideSideLogo={hideSideLogo}
                        setSideLogo={setSideLogo}
                        sidelogo={sidelogo}
                        setBgColor={setBgColor}
                        bgColor={bgColor}
                        setBgImage={setBgImage}
                        bgImage={bgImage}
                        selectedOption={selectedOption}
                        setCheckOutBtnBgColor={setCheckOutBtnBgColor}
                        checkOutBtnBgColor={checkOutBtnBgColor}
                        setCheckoutPaymentOtions={setCheckoutPaymentOtions}
                        CheckoutPaymentOtions={CheckoutPaymentOtions}
                        paymentOptions={paymentOptions}
                        contactOptions={contactOptions}
                        setContactOptions={setContactOptions}
                    />)}

                    {(activeTab === 'checkout' || activeTab === 'thankyou') && (<div className="section-dropdown">
                        <div className="checkout-add-section" onClick={handleClick}>
                            <div className="checkout-add-img"> <img src={add} alt="" /> </div>
                            <div className="checkout-add-text"><p>   Add Section</p></div>
                        </div>
                        <div className="checkout-wrap-li">{sideBarSection && (<ul>
                            {sections.length === 0 ? (
                                <li className="no-options">No more sections to add</li>
                            ) : (
                                sections.map((section, idx) => (
                                    <li key={idx} className="slide-bar-wraper">
                                        <div className="slide-bar-wraper-items ">
                                            <div
                                                className={`slide-bar-wraper-checkout-pagess ${selectedSections.includes(section) ? "active" : ""
                                                    }`}
                                                onClick={() => handleAddSection(section)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <div className="checkout-add-img">
                                                    <img
                                                        src={
                                                            selectedSections.includes(section)
                                                                ? sectionsWithImagesWhite[section]
                                                                : sectionsWithImagesBlack[section]
                                                        }
                                                        alt={section}
                                                        className="section-image"
                                                    />
                                                </div>
                                                <span className="checkout-add-text">
                                                    {sectionDisplayNames[section]
                                                        ? sectionDisplayNames[section]
                                                        : section.charAt(0).toUpperCase() + section.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        {section === "review" && isVisible("review") && (
                                            <div className="add-reviews-wraping">
                                                <h3>Reviews</h3>
                                                <div className="add-reviews-section">
                                                    <div className="add-review-header" >
                                                        <div className='option-img' style={{ cursor: 'pointer' }}
                                                            onClick={async () => {
                                                                const newReview = {
                                                                    productImage: "https://images.pexels.com/photos/7774247/pexels-photo-7774247.jpeg",
                                                                    rating: 5,
                                                                    title: "Review Title",
                                                                    description: "Thankfully, you don’t have to rely on the native option to add Google reviews to website builders, as our free Google reviews widget includes a few simple steps.",
                                                                    name: "John Doe",
                                                                    file: "https://images.pexels.com/photos/3205588/pexels-photo-3205588.jpeg",
                                                                    imageStyle: 'circle',
                                                                    display: "slider",
                                                                    itemsPerRow: 2,
                                                                    heading: 'Review'
                                                                };
                                                                const updatedReviews = [...reviewInputs, newReview];
                                                                setReviewInputs(updatedReviews);
                                                                // await sendCustomData(updatedReviews);
                                                            }}>
                                                            <img src={addicon} alt="" />
                                                        </div>
                                                    </div>

                                                    {reviewInputs.map((input, index) => (
                                                        <div>
                                                            <div className="checkout-page-starr">
                                                                <div className="checkout-blocks">
                                                                    <div className="checkout-add-img"><img src={block} alt="" /></div>
                                                                    <h3>Block</h3>
                                                                </div>
                                                                <div className="checkout-remove-btn">
                                                                    <div
                                                                        onClick={() => toggleCollapse(index)}
                                                                        className={`remove-btn-sidebar drop-btn ${collapsedReviews.includes(index) ? "rotated" : ""}`} >
                                                                        <img src={drop} alt="Collapse" />
                                                                    </div>
                                                                    <div onClick={() => handleRemoveReview(index)} className='remove-btn-sidebar'>
                                                                        <img src={deletebtn1} alt="Remove" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {!collapsedReviews.includes(index) && (
                                                                <div className='review-items-wrap' key={index}>
                                                                    <div className="review-product checkout-side-bar">
                                                                        <label>Product Image</label>
                                                                        {!input.productImage && (
                                                                            <div className="dropzone-images"
                                                                                onDragOver={(e) => e.preventDefault()}
                                                                                onDrop={(e) => {
                                                                                    e.preventDefault();
                                                                                    const file = e.dataTransfer.files[0];
                                                                                    if (file) handleReviewChange(index, "productImage", file);
                                                                                }}
                                                                                onClick={() => document.getElementById(`fileInput-${index}`).click()}
                                                                            >
                                                                                <div className="drop-img">
                                                                                    <img src={drop1} alt="" />
                                                                                </div>
                                                                                <p>Drag & Drop your image here</p>

                                                                                <input
                                                                                    id={`fileInput-${index}`}
                                                                                    type="file"
                                                                                    style={{ display: "none" }}
                                                                                    onChange={(e) => {
                                                                                        const file = e.target.files[0];
                                                                                        handleReviewChange(index, "productImage", file);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {input.productImage && (
                                                                            <div className="review-product-wrapped ">
                                                                                <img
                                                                                    src={
                                                                                        typeof input.productImage === "string"
                                                                                            ? input.productImage.startsWith("http")
                                                                                                ? input.productImage
                                                                                                : `http://localhost:8000${input.productImage}`
                                                                                            : URL.createObjectURL(input.productImage)
                                                                                    }
                                                                                    alt={input.title || "Review product-image"}
                                                                                    className={`review-product-image ${input.imageStyle || ""}`}
                                                                                    onLoad={() => {
                                                                                        if (!(typeof input.productImage === "string")) {
                                                                                            URL.revokeObjectURL(input.productImage);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                <div className='remove-btn-sidebar'
                                                                                    onClick={() => handleReviewChange(index, "productImage", null)} >
                                                                                    <img src={deletebtn1} alt="Remove" />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="review-rating checkout-side-bar">
                                                                        <div className="review-rating-star">
                                                                            <label>Rating ({input.rating || 5} to 5):</label>
                                                                            <img src={starimg} alt="" />
                                                                        </div>
                                                                        <div className="review-items-rating">
                                                                            <input
                                                                                id={`range-slider-${index}`}
                                                                                type="range"
                                                                                min="1"
                                                                                max="5"
                                                                                value={input.rating || 1}
                                                                                style={{
                                                                                    background: `linear-gradient(
                                                                                     to right, 
                                                                                     #2C7680 0%, 
                                                                                     #2C7680 ${((input.rating - 1) / 4) * 100}%, 
                                                                                     #d7dcdf ${((input.rating - 1) / 4) * 100}%, 
                                                                                     #d7dcdf 100%)`}}
                                                                                onChange={(e) => {
                                                                                    const value = Number(e.target.value);
                                                                                    handleReviewChange(index, 'rating', value);

                                                                                    const percent = ((value - 1) / 4) * 100;
                                                                                    e.target.style.background = `linear-gradient(
                                                                                   to right, 
                                                                                   #2C7680 0%, 
                                                                                   #2C7680 ${percent}%, 
                                                                                   #d7dcdf ${percent}%, 
                                                                                   #d7dcdf 100%
                                                                                 )`;
                                                                                }}
                                                                            />

                                                                        </div>
                                                                    </div>
                                                                    <div className="review-title checkout-side-bar">
                                                                        <label>Title</label>
                                                                        <input
                                                                            type="text"
                                                                            value={input.title}
                                                                            onChange={(e) => handleReviewChange(index, 'title', e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div className="review-description checkout-side-bar">
                                                                        <label>Description:</label>
                                                                        <textarea
                                                                            value={input.description}
                                                                            onChange={(e) => handleReviewChange(index, 'description', e.target.value)}
                                                                            rows={4}
                                                                            style={{ width: '100%' }}
                                                                            className="review-description-add"
                                                                        /></div>
                                                                    <div className="review-name checkout-side-bar">
                                                                        <label>Author Name</label>
                                                                        <input
                                                                            type="text"
                                                                            value={input.name || ''}
                                                                            onChange={(e) => handleReviewChange(index, 'name', e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div className="review-img checkout-side-bar">
                                                                        <label>Image</label>
                                                                        {!input.file && (
                                                                            <div
                                                                                className="dropzone-images"
                                                                                onDragOver={(e) => e.preventDefault()}
                                                                                onDrop={(e) => {
                                                                                    e.preventDefault();
                                                                                    const file = e.dataTransfer.files[0];
                                                                                    if (file) handleReviewChange(index, 'file', file);
                                                                                }}
                                                                                onClick={() => document.getElementById(`fileInput-${index}`).click()} >
                                                                                <div className="drop-img">
                                                                                    <img src={drop1} alt="" />
                                                                                </div>
                                                                                <p>Drag & Drop your image here</p>
                                                                                <input
                                                                                    id={`fileInput-${index}`}
                                                                                    type="file"
                                                                                    style={{ display: 'none' }}
                                                                                    onChange={(e) => {
                                                                                        const file = e.target.files[0];
                                                                                        handleReviewChange(index, 'file', file);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {input.file && (
                                                                            <div className="review-product-wrapped ">
                                                                                <img
                                                                                    src={
                                                                                        typeof input.file === 'string'
                                                                                            ? input.file.startsWith('http')
                                                                                                ? input.file
                                                                                                : `http://localhost:8000${input.file}`
                                                                                            : URL.createObjectURL(input.file)
                                                                                    }
                                                                                    alt={input.title || 'Review image'}
                                                                                    className={`review-image ${input.imageStyle || 'square'}`}
                                                                                    style={{ maxWidth: '200px', maxHeight: '200px', display: 'block' }}
                                                                                    onLoad={() => {
                                                                                        if (!(typeof input.file === 'string')) {
                                                                                            URL.revokeObjectURL(input.file);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                <div className='remove-btn-sidebar'
                                                                                    onClick={() => handleReviewChange(index, 'file', null)}>
                                                                                    <img src={deletebtn1} alt="Remove" />
                                                                                </div>

                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="review-style checkout-side-bar">
                                                                        <label>Image style</label>
                                                                        <div className="image-style-options">
                                                                            {["square", "rounded", "circle"].map((style) => (
                                                                                <div className="image-style-wrap"
                                                                                    key={style}
                                                                                    onClick={() => handleReviewChange(index, "imageStyle", style)}
                                                                                    style={{
                                                                                        color: input.imageStyle === style ? '#2F7E89' : '#949393',
                                                                                        border: input.imageStyle === style ? '0.25px solid #2F7E89' : '2px solid transparent',
                                                                                        boxShadow: input.imageStyle === style ? '0px 0px 3px 0px #2F7E894F' : '0px 0px 3px 0px #00000036',
                                                                                    }}
                                                                                >
                                                                                    {style.charAt(0).toUpperCase() + style.slice(1)}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                </div>)}
                                                        </div>
                                                    ))}
                                                    <div className="review-outside-block">
                                                        <div className="review-style checkout-side-bar">
                                                            {selectedSections.includes("review") && (
                                                                <div className="review-outside-review-postion">
                                                                    <label>Review Position:</label>
                                                                    <select className="custom-select"
                                                                        value={sectionPositions?.review || "last"}
                                                                        onChange={(e) =>
                                                                            handleSectionPositionChange("review", e.target.value)
                                                                        } >
                                                                        {getOptions()}
                                                                    </select>
                                                                    <span className="custom-select-icon"> <img src={drop} alt="Collapse" /></span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="review-description checkout-side-bar">
                                                            <label>Heading</label>
                                                            <input
                                                                type="text"
                                                                value={reviewInputs[0]?.heading || ""}
                                                                onChange={(e) => handleReviewChange(0, "heading", e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="review-style checkout-side-bar">
                                                            <div className="custom-select">
                                                                {["slider", "grid"].map((option) => (
                                                                    <div
                                                                        key={option}
                                                                        className={`custom-option-style ${reviewInputs[0]?.display === option ? "active" : ""}`}
                                                                        onClick={() => handleReviewChange(0, "display", option)}
                                                                    >
                                                                        {option}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {reviewInputs[0]?.display === "grid" && (
                                                                <>
                                                                    <div className="custom-select-grid">
                                                                        {[1, 2, 3].map((num) => (
                                                                            <div
                                                                                key={num}
                                                                                className={`custom-option-style-num ${reviewInputs[0]?.itemsPerRow === num ? "active" : ""}`}
                                                                                onClick={() => handleReviewChange(0, "itemsPerRow", num)}
                                                                            >
                                                                                {num.toString().padStart(2, "0")}
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {section === "product" && isVisible("product") && (
                                            <div className="add-reviews-wraping">
                                                <h3>Products</h3>
                                                <div className="add-reviews-section checkout-side-bar">
                                                    <div className="checkout-page-starr">
                                                        <div className="checkout-blocks">
                                                            <div className="checkout-add-img"><img src={pro} alt="" /></div>
                                                            <h3>Add Products</h3>
                                                        </div>
                                                        <div className="checkout-remove-btn">
                                                            <div className='option-img' onClick={() => setShowProductPopup(!showProductPopup)}
                                                                style={{ cursor: 'pointer' }}>
                                                                <img src={addicon} alt="Add" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="product-items">
                                                        {selectedProducts.map((product, index) => (
                                                            <div className="product-item" key={index}>
                                                                {product?.image && (
                                                                    <img
                                                                        src={product.image}
                                                                        alt={product.title} />
                                                                )}
                                                                <span>{product.title.length > 20 ? product.title.slice(0, 20) + '...' : product.title}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {showProductPopup && (
                                                        <div className="product-popup ">
                                                            <button className="close-popup-btn remove-btn" onClick={() => setShowProductPopup(false)}> <img src={crossbtn} alt="Remove" /></button>
                                                            <div className="product-wrapp-popup">
                                                                {products?.map((product, index) => (

                                                                    <div key={index} className='product-popup-item'>
                                                                        <div class="custom-checkbox-wrapper">
                                                                            <input
                                                                                type="checkbox"
                                                                                class="custom-checkbox"
                                                                                checked={selectedProducts.some(p => p.id === product.id)}
                                                                                onChange={() => handleProductSelect(product)}
                                                                            />
                                                                        </div>
                                                                        <div className="product-item">
                                                                            {product?.image && (
                                                                                <img
                                                                                    src={product.image}
                                                                                    alt={product.title}

                                                                                />
                                                                            )}
                                                                            <span>{product.title.length > 30 ? product.title.slice(0, 30) + '...' : product.title}</span>
                                                                        </div>
                                                                    </div>

                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="review-outside-block product">
                                                    <div className="review-style checkout-side-bar">
                                                        {selectedSections.includes("product") && (
                                                            <div className="review-outside-review-postion">
                                                                <label>Product Position:</label>
                                                                <select
                                                                    className="custom-select"
                                                                    value={sectionPositions?.product || "last"}
                                                                    onChange={(e) => handleSectionPositionChange("product", e.target.value)}
                                                                >
                                                                    {getOptions()}
                                                                </select>
                                                                <span className="custom-select-icon"> <img src={drop} alt="Collapse" /></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="review-description checkout-side-bar">
                                                        <label>Heading</label>
                                                        <input
                                                            type="text"
                                                            value={productHeading}
                                                            onChange={(e) => setProductHeading(e.target.value)}
                                                            placeholder="Enter heading here"
                                                        />
                                                    </div>
                                                    <div className="review-style checkout-side-bar">
                                                        <div className='product-syles-wraped'>
                                                            <div className="product-syles">
                                                                {["slider", "Gird"].map((option) => (
                                                                    <div
                                                                        key={option}
                                                                        className={`custom-option-style ${productStyle === option ? "active" : ""}`}
                                                                        onClick={() => handleStyleChange({ target: { value: option } })}
                                                                    >
                                                                        {option === "slider" ? "Slider" : "Gird"}
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {productStyle === "Gird" && (
                                                                <div className="custom-select-grid">
                                                                    {[1, 2, 3].map((num) => (
                                                                        <div
                                                                            key={num}
                                                                            className={`custom-option-style-num ${gridItemsPerRow === num ? "active" : ""}`}
                                                                            onClick={() => setGridItemsPerRow(num)}
                                                                        >
                                                                            {num}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {section === "video" && isVisible("video") && (
                                            <div className="add-reviews-wraping">
                                                <h3>Videos</h3>
                                                <div className="add-reviews-section">
                                                    <div className="checkout-page-starr-wrapper">
                                                        {videoInputs.videos.map((videoUrl, index) => (
                                                            <div key={index}>
                                                                <div className="checkout-page-starr">
                                                                    <div className="checkout-blocks">
                                                                        <div className="checkout-add-img"><img src={block} alt="" /></div>
                                                                        <h3>Block</h3>
                                                                    </div>
                                                                    <div className="checkout-remove-btn">
                                                                        <div
                                                                            onClick={() => toggleVideoCollapse(index)}
                                                                            className={`remove-btn-sidebar drop-btn ${collapsedVideos.includes(index) ? "rotated" : ""
                                                                                }`} >
                                                                            <img src={drop} alt="Collapse" />
                                                                        </div>
                                                                        <div onClick={() => handleRemoveVideo(index)}
                                                                            className="remove-btn-sidebar"
                                                                        >
                                                                            <img src={deletebtn} alt="Remove" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {!collapsedVideos.includes(index) && (
                                                                    <div className="review-items checkout-side-bar review-items-wrap video">
                                                                        <label htmlFor="">Video URL</label>
                                                                        <input
                                                                            type="text"
                                                                            value={videoUrl}
                                                                            placeholder="URL..."
                                                                            onChange={(e) => handleVideoChange(index, e.target.value)}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <div className="option-img" onClick={handleAddVideo}>
                                                            <img src={addicon} alt="Add" />
                                                        </div>
                                                    </div>

                                                    <div className="review-outside-block">
                                                        <div className="review-style checkout-side-bar">
                                                            {selectedSections.includes("video") && (
                                                                <div className="review-outside-review-postion">
                                                                    <label>Video Position</label>
                                                                    <select className="custom-select"
                                                                        value={sectionPositions?.video || "last"}
                                                                        onChange={(e) => handleSectionPositionChange("video", e.target.value)}>
                                                                        {getOptions()}
                                                                    </select>
                                                                    <span className="custom-select-icon"> <img src={drop} alt="Collapse" /></span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="review-style checkout-side-bar">
                                                            <div className="review-description checkout-side-bar">
                                                                <label>Heading</label>
                                                                <input
                                                                    type="text"
                                                                    value={videoInputs.heading}
                                                                    onChange={(e) =>
                                                                        setVideoInputs(prev => ({ ...prev, heading: e.target.value }))
                                                                    }
                                                                    placeholder="Enter heading here"
                                                                />
                                                            </div>

                                                            <div className="custom-select">
                                                                {["slider", "grid"].map((option) => (
                                                                    <div
                                                                        key={option}
                                                                        className={`custom-option-style ${videoInputs.display === option ? "active" : ""}`}
                                                                        onClick={() => setVideoInputs(prev => ({ ...prev, display: option }))} >
                                                                        {option}
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {videoInputs.display === "grid" && (
                                                                <div className="custom-select-grid">
                                                                    {[1, 2, 3].map((num) => (
                                                                        <div
                                                                            key={num}
                                                                            className={`custom-option-style-num ${videoInputs.itemsPerRow === num ? "active" : ""
                                                                                }`}
                                                                            onClick={() =>
                                                                                setVideoInputs((prev) => ({ ...prev, itemsPerRow: num }))
                                                                            }
                                                                        >
                                                                            {num}
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {section === "urgencyBar" && isVisible("urgencyBar") && (
                                            <div className="review-outside-block-bar urgencyBar">
                                                <div className="add-reviews-section">
                                                    <div className="review-style checkout-side-bar">
                                                        {selectedSections.includes("urgencyBar") && (
                                                            <div className="review-outside-review-postion">
                                                                <label>Position</label>
                                                                <select className="custom-select"
                                                                    value={sectionPositions?.urgencyBar || "last"}
                                                                    onChange={(e) => handleSectionPositionChange("urgencyBar", e.target.value)}>
                                                                    {getOptions()}
                                                                </select>
                                                                <span className="custom-select-icon"> <img src={drop} alt="Collapse" /></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="review-description checkout-side-bar review-items-wrap">
                                                        <label>Heading</label>
                                                        <input
                                                            type="text"
                                                            value={selectedbar?.heading || ""}
                                                            placeholder="Heading....."
                                                            onChange={(e) =>
                                                                setSelectedBar({ ...selectedbar, heading: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="review-description checkout-side-bar review-items-wrap">
                                                        <label htmlFor="">Title</label>
                                                        <input
                                                            type="text"
                                                            value={selectedbar?.message || "checkout while item is available"}
                                                            placeholder="Title....."
                                                            onChange={(e) =>
                                                                setSelectedBar({ ...selectedbar, message: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="review-description checkout-side-bar review-items-wrap">
                                                        <label htmlFor="">Subheading </label>
                                                        <input
                                                            type="text"
                                                            value={selectedbar?.subheading || ""}
                                                            placeholder="Subheading....."
                                                            onChange={(e) =>
                                                                setSelectedBar({ ...selectedbar, subheading: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="review-outside-review-postion review-items-wrap">
                                                        <label>Call to Action</label>
                                                        <select className="custom-select"
                                                            value={selectedbar?.action || "button"}
                                                            onChange={(e) =>
                                                                setSelectedBar({ ...selectedbar, action: e.target.value })
                                                            }
                                                        >
                                                            <option value="button">Button</option>
                                                            <option value="_blank">Blank</option>
                                                            <option value="_self">Self</option>
                                                        </select>
                                                        <span className="custom-select-icon"> <img src={drop} alt="Collapse" /></span>
                                                    </div>
                                                    <div className="review-description checkout-side-bar review-items-wrap">
                                                        <label htmlFor="">Button Name</label>
                                                        <input
                                                            type="text"
                                                            value={selectedbar?.btnName || ""}
                                                            placeholder="Button Name....."
                                                            onChange={(e) =>
                                                                setSelectedBar({ ...selectedbar, btnName: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="review-description checkout-side-bar review-items-wrap">
                                                        <label htmlFor="">Link</label>
                                                        <input
                                                            type="text"
                                                            value={selectedbar?.btnLink || ""}
                                                            placeholder="Button Name....."
                                                            onChange={(e) =>
                                                                setSelectedBar({ ...selectedbar, btnLink: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="review-description checkout-side-bar review-items-wrap">
                                                        <label>Timer Labels</label>
                                                        <div className="timer-inputs">
                                                            <div className="timer-inputs-wrap">
                                                                <input
                                                                    type="text"
                                                                    min="0"
                                                                    value={selectedbar?.days ?? 0}
                                                                    placeholder="Days"
                                                                    onChange={(e) => {
                                                                        let val = parseInt(e.target.value) || 0;
                                                                        if (val < 0) val = 0;
                                                                        setSelectedBar({ ...selectedbar, days: val });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="timer-inputs-wrap">
                                                                <input
                                                                    type="text"
                                                                    min="0"
                                                                    max="23"
                                                                    value={selectedbar?.hours ?? 0}
                                                                    placeholder="Hours"
                                                                    onChange={(e) => {
                                                                        let val = parseInt(e.target.value) || 0;
                                                                        if (val < 0) val = 0;
                                                                        if (val > 23) val = 23;
                                                                        setSelectedBar({ ...selectedbar, hours: val });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="timer-inputs-wrap">
                                                                <input
                                                                    type="text"
                                                                    min="0"
                                                                    max="59"
                                                                    value={selectedbar?.minutes ?? 0}
                                                                    placeholder="Minutes"
                                                                    onChange={(e) => {
                                                                        let val = parseInt(e.target.value) || 0;
                                                                        if (val < 0) val = 0;
                                                                        if (val > 59) val = 59;
                                                                        setSelectedBar({ ...selectedbar, minutes: val });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="timer-inputs-wrap">
                                                                <input
                                                                    type="text"
                                                                    min="0"
                                                                    max="59"
                                                                    value={selectedbar?.seconds ?? 0}
                                                                    placeholder="Seconds"
                                                                    onChange={(e) => {
                                                                        let val = parseInt(e.target.value) || 0;
                                                                        if (val < 0) val = 0;
                                                                        if (val > 59) val = 59;
                                                                        setSelectedBar({ ...selectedbar, seconds: val });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <label htmlFor="">End message:</label>
                                                    <input
                                                        type="text"
                                                        value={selectedbar?.endmessage || ""}
                                                        onChange={(e) =>
                                                            setSelectedBar({ ...selectedbar, endmessage: e.target.value })
                                                        }
                                                    />
                                                    <div className="review-description checkout-side-bar review-items-rating review-items-wrap">
                                                        <label htmlFor="btnWidthRange">Button Width <span>{selectedbar?.btnFullWidth || 100}%</span></label>
                                                        <input
                                                            type="range"
                                                            id="btnWidthRange"
                                                            min="10"
                                                            max="100"
                                                            step="1"
                                                            value={selectedbar?.btnFullWidth || 100}
                                                            style={{
                                                                background: `linear-gradient(
                                                               to right, 
                                                               #2C7680 0%, 
                                                               #2C7680 ${selectedbar?.btnFullWidth || 100}%, 
                                                               #d7dcdf ${selectedbar?.btnFullWidth || 100}%, 
                                                               #d7dcdf 100%
                                                                        )`,
                                                            }}

                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value, 10);
                                                                setSelectedBar({ ...selectedbar, btnFullWidth: value });
                                                                const percent = value;
                                                                e.target.style.background = `linear-gradient(
                                                           to right, 
                                                           #2C7680 0%, 
                                                           #2C7680 ${percent}%, 
                                                           #d7dcdf ${percent}%, 
                                                           #d7dcdf 100%
                                                         )`;
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="review-outside-review-postion review-items-wrap">
                                                        <label>Button Position</label>
                                                        <select
                                                            className="custom-select"
                                                            value={selectedbar?.btnPosition || "center"}
                                                            onChange={(e) =>
                                                                setSelectedBar({ ...selectedbar, btnPosition: e.target.value })
                                                            }>
                                                            <option value="left">Left</option>
                                                            <option value="center">Center</option>
                                                            <option value="right">Right</option>
                                                        </select>
                                                        <span className="custom-select-icon">
                                                            <img src={drop} alt="Collapse" />
                                                        </span>
                                                    </div>

                                                    <div className="review-description checkout-side-bar-color review-items-wrap">
                                                        <label>Button Background Color</label>
                                                        <div className="review-color-input">
                                                            <input
                                                                type="color"
                                                                value={selectedbar?.btnBgColor || "#000000"}
                                                                onChange={(e) =>
                                                                    setSelectedBar({ ...selectedbar, btnBgColor: e.target.value })
                                                                } />

                                                            <input
                                                                type="text"
                                                                value={selectedbar?.btnBgColor || "#000000"}
                                                                onChange={(e) =>
                                                                    setSelectedBar({ ...selectedbar, btnBgColor: e.target.value })
                                                                } />
                                                        </div>
                                                    </div>

                                                    <div className="review-description checkout-side-bar-color review-items-wrap">
                                                        <label htmlFor="">Button Color</label>
                                                        <div className="review-color-input">
                                                            <input
                                                                type="color"
                                                                value={selectedbar?.btnColor || ""}
                                                                placeholder="Button Name....."
                                                                onChange={(e) =>
                                                                    setSelectedBar({ ...selectedbar, btnColor: e.target.value })
                                                                }
                                                            />

                                                            <input
                                                                type="text"
                                                                value={selectedbar?.btnColor || "#000000"}
                                                                onChange={(e) =>
                                                                    setSelectedBar({ ...selectedbar, btnColor: e.target.value })
                                                                } />
                                                        </div>
                                                    </div>

                                                    <div className="review-description checkout-side-bar review-items-rating review-items-wrap">
                                                        <label htmlFor="btnWidthRange">
                                                            Button Radius <span>{selectedbar?.btnBorderRadious ?? 10}%</span>
                                                        </label>
                                                        <input
                                                            type="range"
                                                            id="btnWidthRange"
                                                            min="10"
                                                            max="100"
                                                            step="1"
                                                            value={selectedbar?.btnBorderRadious ?? 10}
                                                            style={{
                                                                background: (() => {
                                                                    const min = 10;
                                                                    const max = 100;
                                                                    const value = selectedbar?.btnBorderRadious ?? 10;
                                                                    const percent = ((value - min) / (max - min)) * 100;
                                                                    return `linear-gradient(to right, #2C7680 0%, #2C7680 ${percent}%, #d7dcdf ${percent}%, #d7dcdf 100%)`;
                                                                })(),
                                                            }}
                                                            onChange={(e) => {
                                                                const min = 10;
                                                                const max = 100;
                                                                const value = parseInt(e.target.value, 10);
                                                                setSelectedBar({ ...selectedbar, btnBorderRadious: value });
                                                                const percent = ((value - min) / (max - min)) * 100;
                                                                e.target.style.background = `linear-gradient(to right, #2C7680 0%, #2C7680 ${percent}%, #d7dcdf ${percent}%, #d7dcdf 100%)`;
                                                            }}
                                                        />
                                                    </div>


                                                    <div className="review-outside-review-postion review-items-wrap">
                                                        <label>Text Alignment</label>
                                                        <select
                                                            className="custom-select"
                                                            id="textAlign"
                                                            value={selectedbar?.textAlign || "left"}
                                                            onChange={(e) =>
                                                                setSelectedBar({ ...selectedbar, textAlign: e.target.value })
                                                            }>
                                                            <option value="left">Left</option>
                                                            <option value="center">Center</option>
                                                            <option value="right">Right</option>
                                                        </select>
                                                        <span className="custom-select-icon">
                                                            <img src={drop} alt="Collapse" />
                                                        </span>
                                                    </div>

                                                    <div className="review-description checkout-side-bar-color review-items-wrap">
                                                        <label htmlFor=""> Color</label>
                                                        <div className="review-color-input">
                                                            <input
                                                                type="color"
                                                                id="textColor"
                                                                value={selectedbar?.textColor || "#000000"}
                                                                onChange={(e) =>
                                                                    setSelectedBar({ ...selectedbar, textColor: e.target.value })
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                value={selectedbar?.textColor || "#000000"}
                                                                onChange={(e) =>
                                                                    setSelectedBar({ ...selectedbar, textColor: e.target.value })
                                                                } />
                                                        </div>
                                                    </div>

                                                    <div className="review-description checkout-side-bar-color review-items-wrap">
                                                        <label htmlFor="bgColor">Background Color:</label>
                                                        <div className="review-color-input">
                                                            <input
                                                                type="color"
                                                                id="bgColor"
                                                                value={selectedbar?.backgroundColor || "#ffffff"}
                                                                onChange={(e) =>
                                                                    setSelectedBar({ ...selectedbar, backgroundColor: e.target.value })
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                value={selectedbar?.backgroundColor || "#000000"}
                                                                onChange={(e) =>
                                                                    setSelectedBar({ ...selectedbar, backgroundColor: e.target.value })
                                                                } />
                                                        </div>
                                                    </div>
                                                    <div className="review-description checkout-side-bar review-items-rating review-items-wrap">
                                                        <label htmlFor="padding">
                                                            Padding <span>{selectedbar?.padding ?? 10}px</span>
                                                        </label>
                                                        <input
                                                            type="range"
                                                            id="padding"
                                                            min="10"
                                                            max="100"
                                                            step="1"
                                                            value={selectedbar?.padding ?? 10}
                                                            style={{
                                                                background: `linear-gradient(
                                                               to right, 
                                                               #2C7680 0%, 
                                                               #2C7680 ${((selectedbar?.padding ?? 10) - 10) / 90 * 100}%, 
                                                               #d7dcdf ${((selectedbar?.padding ?? 10) - 10) / 90 * 100}%, 
                                                               #d7dcdf 100%)`,
                                                            }}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value, 10);
                                                                setSelectedBar({ ...selectedbar, padding: value });
                                                                const percent = ((value - 10) / (100 - 10)) * 100;
                                                                e.target.style.background = `linear-gradient(
                                                               to right, 
                                                               #2C7680 0%, 
                                                               #2C7680 ${percent}%, 
                                                               #d7dcdf ${percent}%, 
                                                               #d7dcdf 100%)`;
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="review-description checkout-side-bar review-items-rating review-items-wrap">
                                                        <label htmlFor="fontSize">
                                                            Font Size <span>{selectedbar?.fontSize ?? 16}px</span>
                                                        </label>
                                                        <input
                                                            type="range"
                                                            id="fontSize"
                                                            min="10"
                                                            max="100"
                                                            step="1"
                                                            value={selectedbar?.fontSize ?? 16}
                                                            style={{
                                                                background: `linear-gradient(
                                                           to right, 
                                                           #2C7680 0%, 
                                                           #2C7680 ${((selectedbar?.fontSize ?? 16) - 10) / 90 * 100}%, 
                                                           #d7dcdf ${((selectedbar?.fontSize ?? 16) - 10) / 90 * 100}%, 
                                                           #d7dcdf 100%)`,
                                                            }}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value, 10);
                                                                setSelectedBar({ ...selectedbar, fontSize: value });
                                                                const percent = ((value - 10) / (100 - 10)) * 100;
                                                                e.target.style.background = `linear-gradient(
                                                           to right, 
                                                           #2C7680 0%, 
                                                           #2C7680 ${percent}%, 
                                                           #d7dcdf ${percent}%, 
                                                           #d7dcdf 100%)`;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="review-description checkout-side-bar-color review-items-wrap">
                                                        <label htmlFor="borderColor">Border Color:</label>
                                                        <div className="review-color-input">
                                                            <input
                                                                type="color"
                                                                id="borderColor"
                                                                value={selectedbar?.borderColor || "#000000"}
                                                                onChange={(e) =>
                                                                    setSelectedBar({ ...selectedbar, borderColor: e.target.value })
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                value={selectedbar?.borderColor || "#000000"}
                                                                onChange={(e) =>
                                                                    setSelectedBar({ ...selectedbar, borderColor: e.target.value })
                                                                } />
                                                        </div>
                                                    </div>

                                                    <div className="review-outside-review-postion review-items-wrap">
                                                        <label htmlFor="borderStyle">Border Style:</label>
                                                        <select
                                                            id="borderStyle"
                                                            className="custom-select"
                                                            value={selectedbar?.borderStyle || "solid"}
                                                            onChange={(e) =>
                                                                setSelectedBar({ ...selectedbar, borderStyle: e.target.value })
                                                            }>
                                                            <option value="solid">Solid</option>
                                                            <option value="dashed">Dashed</option>
                                                            <option value="dotted">Dotted</option>
                                                            <option value="none">None</option>
                                                        </select>
                                                        <span className="custom-select-icon">
                                                            <img src={drop} alt="Collapse" />
                                                        </span>
                                                    </div>
                                                    <div className="review-description checkout-side-bar review-items-rating review-items-wrap">
                                                        <label htmlFor="borderRadius">
                                                            Border Radius <span>{selectedbar?.borderRadius ?? 10}px</span>
                                                        </label>
                                                        <input
                                                            type="range"
                                                            id="borderRadius"
                                                            min="0"
                                                            max="100"
                                                            step="1"
                                                            value={selectedbar?.borderRadius ?? 10}
                                                            style={{
                                                                background: `linear-gradient(
                                                             to right, 
                                                             #2C7680 0%, 
                                                             #2C7680 ${((selectedbar?.borderRadius ?? 10) / 100) * 100}%, 
                                                             #d7dcdf ${((selectedbar?.borderRadius ?? 10) / 100) * 100}%, 
                                                             #d7dcdf 100%)`,
                                                            }}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value, 10);
                                                                setSelectedBar({ ...selectedbar, borderRadius: value });

                                                                const percent = (value / 100) * 100;
                                                                e.target.style.background = `linear-gradient(
                                                             to right, 
                                                             #2C7680 0%, 
                                                             #2C7680 ${percent}%, 
                                                             #d7dcdf ${percent}%, 
                                                             #d7dcdf 100%)`;
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {section === "trustBages" && isVisible("trustBages") && (
                                            <div className="add-reviews-wraping">
                                                <h3>Multicolumn</h3>
                                                <div className="add-reviews-section">
                                                    <div className='option-img' style={{ cursor: 'pointer' }}
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedbages([
                                                                ...selectedbages,
                                                                {
                                                                    heading: "",
                                                                    title: "Bages Title",
                                                                    description: "Review Section Inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results.",
                                                                    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ7LKoE92zIcgdcmfNHp4EZMtnDctSZSITQw&s"
                                                                }
                                                            ])
                                                        }
                                                    >
                                                        <img src={addicon} alt="" />
                                                    </div>

                                                    {selectedbages.map((badge, index) => (
                                                        <div>
                                                            <div className="checkout-page-starr">
                                                                <div className="checkout-blocks">
                                                                    <div className="checkout-add-img"><img src={block} alt="" /></div>
                                                                    <h3>Block</h3>
                                                                </div>
                                                                <div className="checkout-remove-btn">
                                                                    <div
                                                                        onClick={() => toggleBagesCollapse(index)}
                                                                        className={`remove-btn-sidebar drop-btn ${collapsedBages.includes(index) ? "rotated" : ""}`} >
                                                                        <img src={drop} alt="Collapse" />
                                                                    </div>
                                                                    <div onClick={() => {
                                                                        const newList = selectedbages.filter((_, i) => i !== index);
                                                                        setSelectedbages(newList);
                                                                    }} className='remove-btn-sidebar'>
                                                                        <img src={deletebtn1} alt="Remove" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {!collapsedBages.includes(index) && (
                                                                <div key={index} className="review-items-wrap">
                                                                    <div className="review-product checkout-side-bar">
                                                                        <label>Product Image</label>
                                                                        {!badge.image && (
                                                                            <div
                                                                                className="dropzone-images"
                                                                                onDragOver={(e) => e.preventDefault()}
                                                                                onDrop={async (e) => {
                                                                                    e.preventDefault();
                                                                                    const file = e.dataTransfer.files[0];
                                                                                    if (file) {

                                                                                        const uploadedUrl = await uploadFile(file);
                                                                                        const newList = [...selectedbages];
                                                                                        newList[index].image = uploadedUrl;
                                                                                        setSelectedbages(newList);
                                                                                    }
                                                                                }}
                                                                                onClick={() => document.getElementById(`fileInput-${index}`).click()}
                                                                            >
                                                                                <div className="drop-img">
                                                                                    <img src={drop1} alt="" />
                                                                                </div>
                                                                                <p>Drag & Drop your image here</p>

                                                                                <input
                                                                                    id={`fileInput-${index}`}
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    style={{ display: "none" }}
                                                                                    onChange={async (e) => {
                                                                                        const file = e.target.files[0];
                                                                                        if (file) {
                                                                                            const uploadedUrl = await uploadFile(file);

                                                                                            const newList = [...selectedbages];
                                                                                            newList[index].image = uploadedUrl;
                                                                                            setSelectedbages(newList);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {badge.image && (
                                                                            <div className="review-product-wrapped">
                                                                                <img
                                                                                    src={
                                                                                        badge.image.startsWith("http")
                                                                                            ? badge.image
                                                                                            : `http://localhost:8000${badge.image}`
                                                                                    }
                                                                                    className={`review-product-image ${badge.imageStyle || ""}`}
                                                                                    alt={badge.title || "Trust Badge"} />
                                                                                <div
                                                                                    className="remove-btn-sidebar"
                                                                                    onClick={() => {
                                                                                        const newList = [...selectedbages];
                                                                                        newList[index].image = null;
                                                                                        setSelectedbages(newList);
                                                                                    }}
                                                                                >
                                                                                    <img src={deletebtn1} alt="Remove" />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="review-title checkout-side-bar">
                                                                        <label>Title</label>
                                                                        <input
                                                                            type="text"
                                                                            value={badge.title || ""}
                                                                            onChange={(e) => {
                                                                                const newList = [...selectedbages];
                                                                                newList[index].title = e.target.value;
                                                                                setSelectedbages(newList);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="review-title checkout-side-bar">
                                                                        <label>Description</label>
                                                                        <textarea
                                                                            value={badge.description || ""}
                                                                            onChange={(e) => {
                                                                                const newList = [...selectedbages];
                                                                                newList[index].description = e.target.value;
                                                                                setSelectedbages(newList);
                                                                            }}
                                                                            rows={4}
                                                                            className="review-description-add"
                                                                            style={{ width: "100%" }}
                                                                        />
                                                                    </div>

                                                                </div>)}
                                                        </div>
                                                    ))}
                                                    <div className="review-outside-block">
                                                        <div className="review-style checkout-side-bar">
                                                            {selectedSections.includes("trustBages") && (
                                                                <div className="review-outside-review-postion">
                                                                    <label>Review Position</label>
                                                                    <select className="custom-select"
                                                                        value={sectionPositions?.trustBages || "last"}
                                                                        onChange={(e) => handleSectionPositionChange("trustBages", e.target.value)}>
                                                                        {getOptions()}
                                                                    </select>
                                                                    <span className="custom-select-icon"> <img src={drop} alt="Collapse" /></span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="review-description checkout-side-bar">
                                                            <label>Heading</label>
                                                            <input
                                                                type="text"
                                                                value={selectedbages[0]?.heading || ""}
                                                                onChange={(e) => {
                                                                    const newList = [...selectedbages];

                                                                    if (newList[0]) {
                                                                        newList[0].heading = e.target.value;
                                                                    } else {
                                                                        newList.push({ heading: e.target.value });
                                                                    }
                                                                    setSelectedbages(newList);
                                                                }}
                                                                placeholder="Enter section heading"
                                                            />
                                                        </div>

                                                        <div className="review-style checkout-side-bar">
                                                            <div className="custom-select">
                                                                {["slider", "grid"].map((option) => (
                                                                    <div
                                                                        key={option}
                                                                        className={`custom-option-style ${bagesStyle === option ? "active" : ""}`}
                                                                        onClick={() => setBagesStyle(option)}
                                                                    >
                                                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {bagesStyle === "grid" && (
                                                                <div className="custom-select-grid">
                                                                    {[1, 2, 3].map((num) => (
                                                                        <div
                                                                            key={num}
                                                                            className={`custom-option-style-num ${gridPerSlide === num ? "active" : ""}`}
                                                                            onClick={() => setGridPerSlide(num)}
                                                                        >
                                                                            {num.toString().padStart(2, "0")}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {section === "richtext" && isVisible("richtext") && (
                                            <div className="add-reviews-wraping">
                                                <div className="review-style checkout-side-bar">
                                                    {selectedSections.includes("richtext") && (
                                                        <div className="review-outside-review-postion">
                                                            <label>Review Position:</label>
                                                            <select className="custom-select"
                                                                value={sectionPositions?.review || "last"}
                                                                onChange={(e) =>
                                                                    handleSectionPositionChange("richtext", e.target.value)
                                                                } >
                                                                {getOptions()}
                                                            </select>
                                                            <span className="custom-select-icon"> <img src={drop} alt="Collapse" /></span>
                                                        </div>
                                                    )}
                                                </div>
                                                {section === "richtext" && isVisible("richtext") && (
                                                    <div className="add-reviews-wraping">
                                                        {(richInputs.length > 0 ? richInputs : [{}]).map((input, index) => (
                                                            <div key={index} className="richtext-item">
                                                                <div className="review-title checkout-side-bar">
                                                                    <label>Heading</label>
                                                                    <input
                                                                        type="text"
                                                                        value={input.title || ""}
                                                                        onChange={(e) => {
                                                                            const newList = [...richInputs];
                                                                            newList[index] = { ...newList[index], title: e.target.value };
                                                                            setRichInputs(newList);
                                                                        }}
                                                                        placeholder="Enter heading"
                                                                    />
                                                                </div>
                                                                <div className="review-title checkout-side-bar texteditor">
                                                                    <label>Description</label>
                                                                    <ReactQuill
                                                                        theme="snow"
                                                                        value={input.description || ""}
                                                                        onChange={(value) => {
                                                                            const newList = [...richInputs];
                                                                            newList[index] = { ...newList[index], description: value };
                                                                            setRichInputs(newList);
                                                                        }}
                                                                        modules={modules}
                                                                        formats={formats}
                                                                        placeholder="Enter description"

                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}

                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>)}</div>

                    </div>)}
                </div>
            </div>
        </div>
    );
} 