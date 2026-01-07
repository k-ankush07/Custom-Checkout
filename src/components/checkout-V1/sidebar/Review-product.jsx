import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import plus from '../../../images/plusslider.png';
import right from '../../../images/right.png';
import left from '../../../images/left.png';
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default function ReviewProduct({ getCurrencySymbol, currency, selectedProducts, productStyle, productHeading,
    gridItemsPerRow, refreshCart, shop, accessToken, storefrontToken }) {

    const [swiperInstance, setSwiperInstance] = useState(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [loadingProductId, setLoadingProductId] = useState(null);

    const handleAddToCart = async (product) => {
        console.log("🛒 Adding product to cart:", product);
        setLoadingProductId(product.id);

        try {
            const url = new URL(window.location.href);
            let cartToken = url.searchParams.get("cart_token") || localStorage.getItem("cart_token");

            let cartId = null;
            if (cartToken && cartToken.trim() !== "") {
                cartId = cartToken.startsWith("gid://shopify/Cart/")
                    ? cartToken
                    : `gid://shopify/Cart/${cartToken}`;
            }

            if (!cartId) {
                const createRes = await fetch(`${apiBaseUrl}/api/cart/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ currency })
                });
                const createData = await createRes.json();
                cartId = createData.id;
                localStorage.setItem("cart_token", cartId);
            }

            const variantId = product.variant_id;
            if (!variantId) {
                console.error("❌ No variant_id provided for product:", product);
                setLoadingProductId(null);
                return;
            }
            const res = await fetch(`${apiBaseUrl}/api/cart/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cartId,
                    variantId,
                    quantity: 1,
                    currency,
                    shop, accessToken, storefrontToken
                })
            });

            const data = await res.json();
            if (res.ok) {
                console.log("✅ Product added to cart:", data);
                refreshCart()
            } else {
                console.error("❌ Failed to add to cart:", data.error || data);
            }

        } catch (err) {
            console.error("❌ Error in handleAddToCart:", err);
        } finally {
            setLoadingProductId(null);
        }
    };


    const handleSwiper = (swiper) => {
        setSwiperInstance(swiper);
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    const handleSlideChange = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    useEffect(() => {
        if (swiperInstance && selectedProducts.length > 0) {
            swiperInstance.slideTo(0);
            setIsBeginning(swiperInstance.isBeginning);
            setIsEnd(swiperInstance.isEnd);
        }
    }, [selectedProducts, swiperInstance]);
    const showNavButtons = selectedProducts.length > 2;

    const [exchangeRates, setExchangeRates] = useState(null);
    const [loadingRates, setLoadingRates] = useState(false);

    useEffect(() => {
        const fetchRates = async () => {
            setLoadingRates(true);
            try {
                const response = await axios.get('https://api.unirateapi.com/api/rates', {
                    params: {
                        api_key: 'fd4zbA40dtNfpRzWnNg2hK3f4r0dBWEDOe3OfW1skaU2GBCOxltg0Q0KlwknSnfm',
                        from: 'INR',
                    },
                });

                setExchangeRates(response.data.rates || null);
            } catch (error) {
                console.error("Failed to fetch exchange rates", error);
                setExchangeRates(null);
            } finally {
                setLoadingRates(false);
            }
        };

        fetchRates();
    }, [currency]);

    const convertPrice = (priceInINR) => {
        if (currency === "BRL") return parseFloat(priceInINR).toFixed(2);

        if (!exchangeRates || !currency) return parseFloat(priceInINR).toFixed(2);

        const rate = exchangeRates[currency];
        if (!rate) return parseFloat(priceInINR).toFixed(2);

        return (parseFloat(priceInINR) * rate).toFixed(2);
    };

    const renderProductCard = (prod) => {
        const productId = prod.id.replace("gid://shopify/Product/", "");
        const imageUrl = prod.image || "";
        const title = prod.title || "";
        const priceINR = prod.price?.split("|")[0].trim() || "0.00";
        const convertedPrice = convertPrice(priceINR);
        const symbol = getCurrencySymbol(currency) || ` ${currency}`;

        return (
            <div
                key={productId}
                className="related-product-card"
                style={{
                    position: "relative",
                    opacity: loadingProductId === prod.id ? 0.5 : 1,
                    pointerEvents: loadingProductId === prod.id ? "none" : "auto",
                }}
            >
                <div className="related-product-card-items">
                    <div className="product-img">
                        <img src={imageUrl} alt={title} className="related-product-image" />
                    </div>
                    <div className="product-title">
                        <h4 className="related-product-title">
                            {title.length > 40 ? title.slice(0, 40) + '...' : title}
                        </h4>
                    </div>
                </div>

                <div className="related-product-bottom-side">
                    <div className="product-price">
                        <p className="related-product-price">
                            {symbol}{convertedPrice}
                        </p>
                    </div>
                    <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(prod)}
                        disabled={loadingProductId === prod.id}
                    >
                        {loadingProductId === prod.id ? (
                            "Adding..."
                        ) : (
                            <>

                                Addv to order
                            </>
                        )}

                    </button>
                </div>

                {loadingProductId === prod.id && (
                    <div className="product-loader">
                        <i className="fa fa-circle-o-notch fa-spin" />
                    </div>
                )}
            </div>
        );
    };

    const gridItems = gridItemsPerRow;

    return (
        <div className="checkout-product-rating sidebar-checkbox prodcuts">
            {productHeading ? <h3>{productHeading}</h3> : <h3>Products</h3>}

            {selectedProducts?.length > 0 && (
                <div className="related-products slider-wrapper">
                    {productStyle === "slider" ? (
                        <div className="related-products-slider-items">
                            <div className="swiper-nav-buttons">
                                <button
                                    className="swiper-button-prev-custom"
                                    onClick={() => swiperInstance?.slidePrev()}
                                >
                                    <img src={left} alt="Previous" className="nav-img" />
                                </button>
                                <button
                                    className="swiper-button-next-custom"
                                    onClick={() => swiperInstance?.slideNext()}
                                >
                                    <img src={right} alt="Next" className="nav-img" />
                                </button>
                            </div>

                            <Swiper
                                onSwiper={handleSwiper}
                                onSlideChange={handleSlideChange}
                                spaceBetween={10}
                                slidesPerView={2}
                                modules={[Navigation]}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                    },
                                    768: {
                                        slidesPerView: 2,
                                    },
                                }}
                            >
                                {selectedProducts.map((prod) => (
                                    <SwiperSlide key={prod.id}>
                                        {renderProductCard(prod)}
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                    ) : (
                        <div
                            className="related-products-list line-view"
                            style={{ gridTemplateColumns: `repeat(${gridItems}, 1fr)` }}
                        >
                            {selectedProducts.map(renderProductCard)}
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}





















// import { useState, useEffect } from "react";
// import deletebtn from '../../images/delete.png';
// import plus from '../../images/plus.png';
// import crossbtn from '../../images/unnamed.png';
// import arrowuper from '../../images/arrow-uper.png';
// import down from '../../images/down.png';
// import star from '../../images/Star-blue.png';
// import plusicon from '../../images/plus-blue.png';
// import video from '../../images/video-blue.png';
// import box from '../../images/box-blue.png';


// export default function Sidebar({ sections, selectedSections, setSelectedSections, shop, products, selectedProducts,
//     setSelectedProducts, reviewInputs, setReviewInputs, productStyle, setProductStyle, videoInputs, setVideoInputs,
//     gridItemsPerRow, setGridItemsPerRow }) {
//     const [isMounted, setIsMounted] = useState(false);
//     const [showProductPopup, setShowProductPopup] = useState(false);
//     const [hiddenSections, setHiddenSections] = useState([]);

//     useEffect(() => {
//         fetch(`http://localhost:8000/custom-data?shop=${encodeURIComponent(shop)}`)
//             .then(res => res.json())
//             .then(data => {
//                 console.log("Fetched custom data:", data);
//                 if (data.options) setSelectedSections(data.options);
//                 if (data.products && products) {
//                     const fullProducts = products.filter(p => data.products.includes(p.id));
//                     setSelectedProducts(fullProducts);
//                 }
//                 if (data.reviews) setReviewInputs(data.reviews);
//                 if (data.styles && data.styles.length > 0) {
//                     setProductStyle(data.styles[0].type);
//                     setGridItemsPerRow(data.styles[0].gridItemsPerRow);
//                 }
//                 if (data.videos) setVideoInputs(data.videos);
//             })
//             .catch(err => console.error("Error fetching custom data:", err));
//     }, [shop]);


//     const handleAddSection = (sectionName) => {
//         setSelectedSections(prev => {
//             const isSelected = prev.includes(sectionName);
//             const updatedSections = isSelected
//                 ? prev.filter(sec => sec !== sectionName)
//                 : [...prev, sectionName];

//             if (!isSelected) {
//                 setHiddenSections(prevHidden =>
//                     prevHidden.includes(sectionName)
//                         ? prevHidden
//                         : [...prevHidden, sectionName]
//                 );


//                 setHiddenSections(prevHidden =>
//                     prevHidden.filter(s => s !== sectionName)
//                 );
//             }

//             return updatedSections;
//         });
//     };

//     const handleToggleSectionContent = (section) => {
//         setHiddenSections((prev) =>
//             prev.includes(section)
//                 ? prev.filter((s) => s !== section)
//                 : [...prev, section]
//         );
//     };

//     const isVisible = (section) =>
//         selectedSections.includes(section) && !hiddenSections.includes(section);

//     const handleStyleChange = (e) => {
//         setProductStyle(e.target.value);
//     };

//     const handleProductSelect = (product) => {
//         let updatedProducts;
//         const isAlreadySelected = selectedProducts.some(p => p.id === product.id);

//         if (isAlreadySelected) {
//             updatedProducts = selectedProducts.filter(p => p.id !== product.id);
//         } else {
//             updatedProducts = [...selectedProducts, product];
//         }

//         setSelectedProducts(updatedProducts);

//         if (!selectedSections.includes('product')) {
//             setSelectedSections([...selectedSections, 'product']);
//         }
//     };

//     const handleVideoChange = (index, value) => {
//         const updated = [...videoInputs];
//         updated[index] = value;
//         setVideoInputs(updated);
//     };

//     const handleAddVideo = () => {
//         if (videoInputs.length >= 4) {
//             alert("You can only add up to 4 videos.");
//             return;
//         }
//         setVideoInputs([...videoInputs, ""]);
//     };

//     const handleRemoveVideo = (index) => {
//         const updated = [...videoInputs];
//         updated.splice(index, 1);
//         setVideoInputs(updated);

//     };

//     useEffect(() => {
//         if (selectedSections.includes("review") && reviewInputs.length === 0) {
//             setReviewInputs([""]);
//         }

//         if (selectedSections.includes("video") && videoInputs.length === 0) {
//             setVideoInputs([""]);
//         }
//     }, [selectedSections]);


//     useEffect(() => {
//         if (isMounted) {
//             sendCustomData();
//         } else {
//             setIsMounted(true);
//         }
//     }, [selectedSections, selectedProducts, reviewInputs, productStyle, videoInputs, gridItemsPerRow]);


//     const sendCustomData = () => {
//         const payload = {
//             shop,
//             options: selectedSections,
//             reviews: reviewInputs,
//             videos: videoInputs.filter(v => v.trim() !== ''),
//             products: selectedProducts.map(p => p.id),
//             styles: [{ type: productStyle, gridItemsPerRow }]
//         };

//         console.log("🟡 Payload being sent:", JSON.stringify(payload, null, 2));

//         fetch('http://localhost:8000/custom-data', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload)
//         })
//             .then(response => response.json())
//             .then(data => console.log("📤 Sent:", data))
//             .catch(error => console.error("❌ Error sending data:", error));
//     };

//     return (
//         <div className="checkout-page-side-bar">
//             <div className="checkout-contact checkout-h3 sidebar">
//                 <h3>Home page</h3>
//             </div>
//             <div className="checkout-page-header-section">
//                 <h3>Header</h3>

//                 <div style={{ position: 'relative' }}>

//                     <div className="section-dropdown">
//                         <ul>
//                             {sections.length === 0 ? (
//                                 <li className="no-options">No more sections to add</li>
//                             ) : (
//                                 sections.map((section, idx) => (
//                                     <li key={idx} className="slide-bar-wraper">
//                                         <div className="slide-bar-wraper-items ">
//                                             <div className="slide-bar-wraper-checkout-pagess">
//                                                 <input
//                                                     type="checkbox"
//                                                     className="custom-checkbox"
//                                                     checked={selectedSections.includes(section)}
//                                                     onChange={() => handleAddSection(section)}
//                                                 />
//                                                 <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
//                                             </div>
//                                             {selectedSections.includes(section) && (
//                                                 <>
//                                                     {hiddenSections.includes(section) ? (
//                                                         <img
//                                                             src={down}
//                                                             alt="Show"
//                                                             onClick={() => handleToggleSectionContent(section)}
//                                                             style={{ cursor: "pointer" }}
//                                                         />
//                                                     ) : (
//                                                         <img
//                                                             src={arrowuper}
//                                                             alt="Hide"
//                                                             onClick={() => handleToggleSectionContent(section)}
//                                                             style={{ cursor: "pointer" }}
//                                                         />
//                                                     )}
//                                                 </>
//                                             )}
//                                         </div>

//                                         {section === "product" && isVisible("product") && (
//                                             <>
//                                                 <div className="add-reviews-section">
//                                                     <div className="add-review-header">
//                                                         <div className="checkout-page-starr">
//                                                             <img src={star} alt="" />
//                                                             <h3>Add Product:</h3>
//                                                         </div>
//                                                         <div className='option-img' onClick={() => setShowProductPopup(!showProductPopup)}
//                                                             style={{ cursor: 'pointer' }}>
//                                                             <img src={plusicon} alt="Add" />
//                                                         </div>
//                                                     </div>

//                                                     <div className="product-items">
//                                                         {selectedProducts.map((product, index) => (
//                                                             <div className="product-item" key={index}>
//                                                                 {product?.image && (
//                                                                     <img
//                                                                         src={product.image}
//                                                                         alt={product.title}
//                                                                         style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '5px' }}
//                                                                     />
//                                                                 )}
//                                                                 <span>{product.title.length > 30 ? product.title.slice(0, 30) + '...' : product.title}</span>
//                                                             </div>
//                                                         ))}
//                                                     </div>

//                                                     {showProductPopup && (
//                                                         <div className="product-popup">
//                                                             <button className="close-popup-btn remove-btn" onClick={() => setShowProductPopup(false)}> <img src={crossbtn} alt="Remove" /></button>
//                                                             {products?.map((product, index) => (
//                                                                 <div key={index} className='product-popup-item'>
//                                                                     <div class="custom-checkbox-wrapper">
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             class="custom-checkbox"
//                                                                             checked={selectedProducts.some(p => p.id === product.id)}
//                                                                             onChange={() => handleProductSelect(product)}
//                                                                         />
//                                                                     </div>
//                                                                     {product?.image && (
//                                                                         <img
//                                                                             src={product.image}
//                                                                             alt={product.title}
//                                                                             style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
//                                                                         />
//                                                                     )}
//                                                                     <span>{product.title.length > 30 ? product.title.slice(0, 30) + '...' : product.title}</span>

//                                                                 </div>
//                                                             ))}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 <div className='product-syles-wraped'>
//                                                     <div className="checkout-page-starr">
//                                                         <img src={box} alt="" />
//                                                         <h3> Product style:</h3>
//                                                     </div>
//                                                     <div className="product-syles">
//                                                         <label className="style-option">
//                                                             <input
//                                                                 type="radio"
//                                                                 name="style"
//                                                                 value="slider"
//                                                                 checked={productStyle === "slider"}
//                                                                 onChange={handleStyleChange}
//                                                             />
//                                                             <span>Slider</span>
//                                                         </label>

//                                                         <label className="style-option">
//                                                             <input
//                                                                 type="radio"
//                                                                 name="style"
//                                                                 value="line"
//                                                                 checked={productStyle === "line"}
//                                                                 onChange={handleStyleChange}
//                                                             />
//                                                             <span>Grid</span>
//                                                         </label>
//                                                     </div>
//                                                     {productStyle === "line" && (
//                                                         <div className="grid-items-option">
//                                                             <label>
//                                                                 <input
//                                                                     type="radio"
//                                                                     name="gridItems"
//                                                                     value="1"
//                                                                     checked={gridItemsPerRow === 1}
//                                                                     onChange={() => setGridItemsPerRow(1)}
//                                                                 />
//                                                                 Show 1 per row
//                                                             </label>
//                                                             <label>
//                                                                 <input
//                                                                     type="radio"
//                                                                     name="gridItems"
//                                                                     value="2"
//                                                                     checked={gridItemsPerRow === 2}
//                                                                     onChange={() => setGridItemsPerRow(2)}
//                                                                 />
//                                                                 Show 2 per row
//                                                             </label>
//                                                             <label>
//                                                                 <input
//                                                                     type="radio"
//                                                                     name="gridItems"
//                                                                     value="3"
//                                                                     checked={gridItemsPerRow === 3}
//                                                                     onChange={() => setGridItemsPerRow(3)}
//                                                                 />
//                                                                 Show 3 per row
//                                                             </label>
//                                                         </div>
//                                                     )}

//                                                 </div>
//                                             </>

//                                         )}

//                                     </li>
//                                 ))
//                             )}
//                         </ul>

//                     </div>
//                 </div>


//             </div>
//         </div>
//     );
// }  