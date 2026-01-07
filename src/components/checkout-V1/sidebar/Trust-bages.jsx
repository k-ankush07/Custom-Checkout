import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import left from '../../../images/left.png';
import right from '../../../images/right.png';

export default function TrustBages({ selectedbages, bagesStyle, gridPerSlide }) {
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    if (!Array.isArray(selectedbages)) selectedbages = [selectedbages];

    const handleSlideChange = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    const handleSwiper = (swiper) => {
        setSwiperInstance(swiper);
        swiper.update();
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };


    useEffect(() => {
        if (swiperInstance) {
            swiperInstance.update();
            setIsBeginning(swiperInstance.isBeginning);
            setIsEnd(swiperInstance.isEnd);
        }
    }, [swiperInstance, selectedbages]);

    const showNavButtons = selectedbages?.length > 2;

    const renderProductCard = (badge, index) => (
        <div key={index} className="checkout-page-trust-bages">
            <div className="trustBages-image">
                {badge.image && (
                    typeof badge.image === "string" ? (
                        <img
                            src={badge.image.startsWith("http") ? badge.image : `http://localhost:8000${badge.image}`}
                            alt={badge.title || "Trust badge"}

                        />
                    ) : (
                        <img
                            src={URL.createObjectURL(badge.image)}
                            alt={badge.title || "Trust badge"}
                            onLoad={() => URL.revokeObjectURL(badge.image)}

                        />
                    )
                )}
            </div>
            <div className="trustBages-title"><h3>{badge.title}</h3></div>
            <div className="trustBages-description">{badge.description}</div>
        </div>
    );

    return (
        <div className="checkout-product-rating-reivew sidebar-checkbox trusted">
            <div className="trustBages-section-heading">
                <h3>{selectedbages[0]?.heading || 'Multicolumn'}</h3>
            </div>

            <div className="related-products slider-wrapper">
                {selectedbages.length > 0 && (
                    bagesStyle === "slider" ? (
                        <div className="related-products-slider-items-reviews">
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
                                spaceBetween={16}
                                slidesPerView={2}
                                modules={[Navigation]}
                                breakpoints={{
                                    0: { slidesPerView: 1 },
                                    768: { slidesPerView: 2 },
                                }}
                            >
                                {selectedbages.map((badge, index) => (
                                    <SwiperSlide key={index}>
                                        {renderProductCard(badge, index)}
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    ) : (
                        <div
                            className="related-products-list line-view review"
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${gridPerSlide}, 1fr)`,
                                gap: "16px",
                            }}
                        >
                            {selectedbages.map((badge, index) => renderProductCard(badge, index))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
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
//     selectedbar, setSelectedBar, selectedbages, setSelectedbages, setBagesStyle, bagesStyle, gridPerSlide, setGridPerSlide }) {
//     const [isMounted, setIsMounted] = useState(false);
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
//                 if (data.styles) {
//                     if (data.styles.productStyle) setProductStyle(data.styles.productStyle);

//                     if (data.styles.bagesStyle) setBagesStyle(data.styles.bagesStyle);

//                     if (data.styles.gridPerSlide) setGridPerSlide(data.styles.gridPerSlide);
//                 }
//                 if (data.videos) setVideoInputs(data.videos);
//                 if (data.urgencyBar) {
//                     setSelectedBar(data.urgencyBar);
//                 }
//                 if (data.trustBages) {
//                     setSelectedbages(Array.isArray(data.trustBages) ? data.trustBages : [data.trustBages]);
//                 }
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


//     useEffect(() => {
//         if (selectedSections.includes("review") && reviewInputs.length === 0) {
//             setReviewInputs([""]);
//         }

//         if (selectedSections.includes("video") && videoInputs.length === 0) {
//             setVideoInputs([""]);
//         }
//         if (selectedSections.includes("trustBages") && selectedbages.length === 0) {
//             setSelectedbages([{
//                 title: "Bages Title",
//                 description: "Review Section Inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results.",
//                 image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ7LKoE92zIcgdcmfNHp4EZMtnDctSZSITQw&s"
//             }]);
//         }
//     }, [selectedSections]);


//     useEffect(() => {
//         if (isMounted) {
//             sendCustomData();
//         } else {
//             setIsMounted(true);
//         }
//     }, [selectedSections, selectedProducts, reviewInputs, productStyle, videoInputs, selectedbar, selectedbages, gridPerSlide, bagesStyle]);

//     const uploadFile = async (file) => {
//         const formData = new FormData();
//         formData.append('file', file);

//         const response = await fetch('http://localhost:8000/upload-file', {
//             method: 'POST',
//             body: formData,
//         });
//         if (!response.ok) throw new Error('File upload failed');
//         const data = await response.json();
//         return data.url;
//     };

//     const sendCustomData = async (updatedReviews = reviewInputs) => {
//         try {
//             const reviewsWithUrls = await Promise.all(
//                 updatedReviews.map(async (review) => {
//                     let uploadedFileUrl = review.file;
//                     let uploadedProductImageUrl = review.productImage;

//                     if (review.file && typeof review.file !== 'string') {
//                         uploadedFileUrl = await uploadFile(review.file);
//                     }

//                     if (review.productImage && typeof review.productImage !== 'string') {
//                         uploadedProductImageUrl = await uploadFile(review.productImage);
//                     }

//                     return {
//                         ...review,
//                         file: uploadedFileUrl,
//                         productImage: uploadedProductImageUrl,
//                     };
//                 })
//             );

//             const payload = {
//                 shop,
//                 options: selectedSections,
//                 reviews: reviewsWithUrls.filter(r => {
//                     const ratingNum = Number(r.rating);
//                     return !isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5;
//                 }),
//                 products: selectedProducts.map(p => p.id),
//                 styles: {
//                     productStyle: productStyle, bagesStyle: bagesStyle, gridPerSlide: gridPerSlide,
//                 },
//                 urgencyBar: selectedbar || {},
//                 trustBages: selectedbages || {}
//             };

//             console.log("🟡 Payload being sent:", JSON.stringify(payload, null, 2));

//             const response = await fetch('http://localhost:8000/custom-data', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(payload)
//             });

//             const data = await response.json();
//             console.log("📤 Sent:", data);

//         } catch (error) {
//             console.error("❌ Error sending data:", error);
//         }
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

//                                         {section === "trustBages" && isVisible("trustBages") && (
//                                             <div className="add-reviews-section">
//                                                 <div className="add-review-header">
//                                                     <div className="checkout-page-starr">
//                                                         <img src={video} alt="" />
//                                                         <h3>Add TrustBages</h3>
//                                                     </div>
//                                                 </div>

//                                                 {selectedbages.map((badge, index) => (
//                                                     <div key={index} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
//                                                         <label>Title:</label>
//                                                         <input
//                                                             type="text"
//                                                             value={badge.title || ""}
//                                                             onChange={(e) => {
//                                                                 const newList = [...selectedbages];
//                                                                 newList[index].title = e.target.value;
//                                                                 setSelectedbages(newList);
//                                                             }}
//                                                         />

//                                                         <label>Description:</label>
//                                                         <input
//                                                             type="text"
//                                                             value={badge.description || ""}
//                                                             onChange={(e) => {
//                                                                 const newList = [...selectedbages];
//                                                                 newList[index].description = e.target.value;
//                                                                 setSelectedbages(newList);
//                                                             }}
//                                                         />

//                                                         <label>Upload Image:</label>
//                                                         <input
//                                                             type="file"
//                                                             accept="image/*"
//                                                             onChange={async (e) => {
//                                                                 const file = e.target.files[0];
//                                                                 if (file) {
//                                                                     const uploadedUrl = await uploadFile(file);
//                                                                     const newList = [...selectedbages];
//                                                                     newList[index].image = uploadedUrl;
//                                                                     setSelectedbages(newList);
//                                                                 }
//                                                             }}
//                                                         />

//                                                         {badge.image && (
//                                                             <img
//                                                                 src={badge.image.startsWith('http') ? badge.image : `http://localhost:8000${badge.image}`}
//                                                                 alt={badge.title || "Trust Badge"}
//                                                                 style={{ maxWidth: '150px', maxHeight: '150px', marginTop: '10px' }}
//                                                             />
//                                                         )}

//                                                         <button
//                                                             type="button"
//                                                             onClick={() => {
//                                                                 const newList = selectedbages.filter((_, i) => i !== index);
//                                                                 setSelectedbages(newList);
//                                                             }}

//                                                         >
//                                                             Remove
//                                                         </button>
//                                                     </div>
//                                                 ))}

//                                                 <label htmlFor="styleSelect">Style:</label>
//                                                 <select
//                                                     id="styleSelect"
//                                                     value={bagesStyle}
//                                                     onChange={(e) => setBagesStyle(e.target.value)}
//                                                 >
//                                                     <option value="slider">Slider</option>
//                                                     <option value="grid">Grid</option>
//                                                 </select>

//                                                 {bagesStyle === "grid" && (
//                                                     <div>
//                                                         <label htmlFor="gridSelect">Show per slide:</label>
//                                                         <select
//                                                             id="gridSelect"
//                                                             value={gridPerSlide}
//                                                             onChange={(e) => setGridPerSlide(Number(e.target.value))}
//                                                         >
//                                                             <option value={1}>1</option>
//                                                             <option value={2}>2</option>
//                                                             <option value={3}>3</option>
//                                                         </select>
//                                                     </div>
//                                                 )}

//                                                 <button
//                                                     type="button"
//                                                     onClick={() =>
//                                                         setSelectedbages([
//                                                             ...selectedbages,
//                                                             {
//                                                                 title: "Bages Title",
//                                                                 description: "Review Section Inspirational designs, illustrations, and graphic elements from the world's best designers. Want more inspiration? Browse our search results.",
//                                                                 image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ7LKoE92zIcgdcmfNHp4EZMtnDctSZSITQw&s"
//                                                             }
//                                                         ])
//                                                     }
//                                                 >
//                                                     Add More Trust Badge
//                                                 </button>

//                                             </div>
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