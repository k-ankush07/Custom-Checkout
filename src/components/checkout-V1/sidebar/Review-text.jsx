import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import right from "../../../images/righta.webp";
import left from "../../../images/lefta.webp";

export default function ReviewText({ reviewInputs }) {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? "#FFD700" : "#ccc",
            fontSize: "15px",
          }}
        >
          {i <= rating ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };

  const getImageStyle = (imageStyle) => {
    switch (imageStyle) {
      case "circle":
        return {
          borderRadius: "100%",
          objectFit: "cover",
          width: "100%",
          height: "100%",
        };
      case "rounded":
        return {
          borderRadius: "10px",
          width: "100%",
          height: "100%",
        };
      case "square":
      default:
        return {
          borderRadius: 0,
          width: "100%",
          height: "100%",
        };
    }
  };

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
  }, [swiperInstance, reviewInputs]);

  const productStyle = reviewInputs?.[0]?.display || "slider";

  const renderProductCard = (review, index) => {
    return (
      <div key={index} className="review-item">
        {review.productImage && (
          <div className="review-product-image" style={{ width: "100%", height: "190px", overflow: "hidden" }}>
            {typeof review.productImage === "string" ? (
              <img
                src={
                  review.productImage.startsWith("http")
                    ? review.productImage
                    : `http://localhost:8000${review.productImage}`
                }
                alt={review.title || "Product image"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <img
                src={URL.createObjectURL(review.productImage)}
                alt={review.title || "Product image"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onLoad={() => URL.revokeObjectURL(review.productImage)}
              />
            )}
          </div>

        )}
        <div className="review-wrapped-items">
          <div className="review-wrapped">
            <div className="review-rating">{renderStars(review.rating)}</div>
            <div className="review-title">
              <h4>{review.title || ""}</h4>
            </div>
          </div>
          <div className="review-description">{review.description || ""}</div>
          <div className="review-item-wrap">
            <div className="review-image">
              {review.file && (
                typeof review.file === "string" ? (
                  <img
                    src={
                      review.file.startsWith("http")
                        ? review.file
                        : `http://localhost:8000${review.file}`
                    }
                    alt={review.title || "Review image"}
                    style={getImageStyle(review.imageStyle)}
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(review.file)}
                    alt={review.title || "Review image"}
                    style={getImageStyle(review.imageStyle)}
                    onLoad={() => URL.revokeObjectURL(review.file)}
                  />
                )
              )}
            </div>
            <div className="review-name">
              <h6>{review.name || ""}</h6>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="checkout-product-rating-reivew sidebar-checkbox">
      <div className="related-products slider-wrapper">
        {reviewInputs.length > 0 && (
          productStyle === "slider" ? (
            <div className="related-products-slider-items-reviews">
              <h2>{reviewInputs[0]?.heading || ""}</h2>
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
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                }}
              >
                {reviewInputs.map((review, index) => (
                  <SwiperSlide key={index}>
                    {renderProductCard(review, index)}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div
              className="related-products-list line-view review"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${reviewInputs[0]?.itemsPerRow || 3}, 1fr)`,
                gap: "10px",
              }}
            >
              {reviewInputs.map((review, index) =>
                renderProductCard(review, index)
              )}
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
//     setSelectedProducts, reviewInputs, setReviewInputs, productStyle, setProductStyle, videoInputs, setVideoInputs }) {
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
//                     setProductStyle(data.styles[0]);
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

//     const handleReviewChange = (index, field, value) => {
//         const updated = [...reviewInputs];
//         updated[index] = { ...updated[index], [field]: value };
//         setReviewInputs(updated);

//         console.log(updated)
//     };

//     const handleRemoveReview = (index) => {
//         const updated = [...reviewInputs];
//         updated.splice(index, 1);
//         setReviewInputs(updated);

//         sendCustomData(updated);
//     };

//     useEffect(() => {
//         if (selectedSections.includes("review") && reviewInputs.length === 0) {
//             setReviewInputs([
//                 {
//                     productImage: "https://images.pexels.com/photos/7774247/pexels-photo-7774247.jpeg",
//                     rating: 5,
//                     title: "Review Title",
//                     description:
//                         "Thankfully, you don’t have to rely on the native option to add Google reviews to website builders, as our free Google reviews widget includes a few simple steps.",
//                     name: "John Doe",
//                     file: "https://images.pexels.com/photos/3205588/pexels-photo-3205588.jpeg",
//                     imageStyle: "circle",
//                     display: "slider",
//                     itemsPerRow: 2
//                 }
//             ]);
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
//     }, [selectedSections, selectedProducts, reviewInputs, productStyle, videoInputs]);

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
//                 videos: videoInputs.filter(v => v.trim() !== ''),
//                 products: selectedProducts.map(p => p.id),
//                 styles: [productStyle],
//             };

//             console.log("🟡 Payload being sent:", JSON.stringify(payload, null, 2));

//             const response = await fetch('http://localhost:8000/custom-data', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload),
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

//                                         {section === "review" && isVisible("review") && (
//                                             <div className="add-reviews-section">
//                                                 <div className="add-review-header" >
//                                                     <div className="checkout-page-starr">
//                                                         <img src={star} alt="" />
//                                                         <h3>Add Reviews:</h3>
//                                                     </div>
//                                                     <div className='option-img' style={{ cursor: 'pointer' }}
//                                                         onClick={() => {
//                                                             const newReview = {
//                                                                 productImage: "https://images.pexels.com/photos/7774247/pexels-photo-7774247.jpeg",
//                                                                 rating: 5,
//                                                                 title: "Review Title",
//                                                                 description: "Thankfully, you don’t have to rely on the native option to add Google reviews to website builders, as our free Google reviews widget includes a few simple steps.",
//                                                                 name: "John Doe",
//                                                                 file: "https://images.pexels.com/photos/3205588/pexels-photo-3205588.jpeg",
//                                                                 imageStyle: 'circle',
//                                                                 display: "slider",
//                                                                 itemsPerRow: 2
//                                                             };

//                                                             const updatedReviews = [...reviewInputs, newReview];
//                                                             setReviewInputs(updatedReviews);
//                                                             sendCustomData(updatedReviews);
//                                                         }}
//                                                     >
//                                                         <img src={plusicon} alt="" />
//                                                     </div>
//                                                 </div>
//                                                 {reviewInputs.map((input, index) => (
//                                                     <div>
//                                                         <div className='review-items-wrap' key={index}>
//                                                             <label>Product Image:</label>
//                                                             <input
//                                                                 type="file"
//                                                                 onChange={(e) => {
//                                                                     const file = e.target.files[0];
//                                                                     handleReviewChange(index, 'productImage', file);
//                                                                 }}
//                                                             />
//                                                             {input.productImage && (
//                                                                 typeof input.productImage === "string" ? (
//                                                                     <img
//                                                                         src={input.productImage.startsWith('http') ? input.productImage : `http://localhost:8000${input.productImage}`}
//                                                                         alt={input.title || "Review product-image"}
//                                                                         className={`review-product-image ${input.imageStyle || ""}`}
//                                                                         style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
//                                                                     />
//                                                                 ) : (
//                                                                     <img
//                                                                         src={URL.createObjectURL(input.productImage)}
//                                                                         alt={input.title || "Review product-image"}
//                                                                         className={`review-product-image ${input.imageStyle || ""}`}
//                                                                         style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
//                                                                         onLoad={() => URL.revokeObjectURL(input.productImage)}
//                                                                     />
//                                                                 )
//                                                             )}
//                                                             <label>Rating ({input.rating || 5} to 5):</label>
//                                                             <div className="review-items-rating">
//                                                                 <input type="range" min="1" max="5" value={input.rating || 1}
//                                                                     onChange={(e) => handleReviewChange(index, 'rating', Number(e.target.value))}
//                                                                 />
//                                                             </div>

//                                                             <label>Title:</label>
//                                                             <input
//                                                                 type="text"
//                                                                 value={input.title}
//                                                                 onChange={(e) => handleReviewChange(index, 'title', e.target.value)}
//                                                             />
//                                                             <label>Description:</label>
//                                                             <textarea
//                                                                 value={input.description}
//                                                                 onChange={(e) => handleReviewChange(index, 'description', e.target.value)}
//                                                                 rows={4}
//                                                                 style={{ width: '100%' }}
//                                                                 className="review-description-add"
//                                                             />

//                                                             <label>Name:</label>
//                                                             <input
//                                                                 type="text"
//                                                                 value={input.name || ''}
//                                                                 onChange={(e) => handleReviewChange(index, 'name', e.target.value)}
//                                                             />
//                                                             <label>Image:</label>
//                                                             <input
//                                                                 type="file"
//                                                                 onChange={(e) => {
//                                                                     const file = e.target.files[0];
//                                                                     handleReviewChange(index, 'file', file);
//                                                                 }}
//                                                             />
//                                                             <label>Image style:</label>
//                                                             <select
//                                                                 value={input.imageStyle || "square"}
//                                                                 onChange={(e) => handleReviewChange(index, "imageStyle", e.target.value)}
//                                                             >
//                                                                 <option value="square">Square</option>
//                                                                 <option value="rounded">Rounded</option>
//                                                                 <option value="circle">Circle</option>
//                                                             </select>
//                                                             {input.file && (
//                                                                 typeof input.file === "string" ? (
//                                                                     <img
//                                                                         src={input.file.startsWith('http') ? input.file : `http://localhost:8000${input.file}`}
//                                                                         alt={input.title || "Review image"}
//                                                                         className={`review-image ${input.imageStyle || "square"}`}
//                                                                         style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
//                                                                     />
//                                                                 ) : (
//                                                                     <img
//                                                                         src={URL.createObjectURL(input.file)}
//                                                                         alt={input.title || "Review image"}
//                                                                         className={`review-image ${input.imageStyle || "square"}`}
//                                                                         style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
//                                                                         onLoad={() => URL.revokeObjectURL(input.file)}
//                                                                     />
//                                                                 )
//                                                             )}
//                                                             <button onClick={() => handleRemoveReview(index)} className='remove-btn sidebar' style={{ cursor: 'pointer' }}>
//                                                                 <img src={deletebtn} alt="Remove" />
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                                 <label>Display style:</label>
//                                                 <select
//                                                     value={reviewInputs[0]?.display || "slider"}
//                                                     onChange={(e) => handleReviewChange(0, "display", e.target.value)}
//                                                 >
//                                                     <option value="slider">slider</option>
//                                                     <option value="grid">grid</option>
//                                                 </select>

//                                                 {reviewInputs[0]?.display === "grid" && (
//                                                     <>
//                                                         <label>Items per row:</label>
//                                                         <select
//                                                             value={reviewInputs[0]?.itemsPerRow || 2}
//                                                             onChange={(e) => handleReviewChange(0, "itemsPerRow", Number(e.target.value))}
//                                                         >
//                                                             <option value={1}>1</option>
//                                                             <option value={2}>2</option>
//                                                         </select>
//                                                     </>
//                                                 )}

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
