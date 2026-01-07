import { useRef, useState, useEffect } from 'react';
import playImage from '../../../images/videobtn.png';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import plus from '../../../images/plusslider.png';
import right from '../../../images/right.png';
import left from '../../../images/left.png';
import axios from 'axios';

export default function ReviewVideo({ videoInputs, }) {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const videoRefs = useRef([]);

  const isYouTubeOrVimeo = (url) =>
    /youtube\.com|youtu\.be|vimeo\.com/.test(url);

  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
  };

  const getVimeoEmbedUrl = (url) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : '';
  };

  const filteredVideos = videoInputs?.videos?.filter((url) => url.trim() !== '');
  const productStyle = videoInputs?.display || "slider";
  const itemsPerRow = videoInputs?.itemsPerRow || 2;
  const videoHeading = videoInputs?.heading || 'Videos';

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
  }, [swiperInstance, videoInputs]);

  const showNavButtons = filteredVideos?.length > 2;

  const renderVideo = (videoUrl, index) => {
    if (isYouTubeOrVimeo(videoUrl)) {
      const embedUrl = videoUrl.includes('youtube')
        ? getYouTubeEmbedUrl(videoUrl)
        : getVimeoEmbedUrl(videoUrl);

      return (
        <div key={index} className="video-item" style={{ marginBottom: '20px' }}>
          <iframe
            width="100%"
            height="315"
            src={embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    return <VideoWithOverlay key={index} src={videoUrl} index={index}  videoRefs={videoRefs} />;
  };


  return (
    <div className="checkout-product-rating-reivew  video sidebar-checkbox ">
      <h3 className="video-heading">{videoHeading}</h3>
      <div className="related-products slider-wrapper">
        {productStyle === "slider" ? (
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
              slidesPerView={3}
              modules={[Navigation]}
              breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 } }}
            >
              {filteredVideos.map((videoUrl, index) => (
                <SwiperSlide key={index}>
                  {renderVideo(videoUrl, index)}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div
            className="related-products-list line-view review videos"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
              gap: "16px",
            }}
          >
            {filteredVideos.map((videoUrl, index) => renderVideo(videoUrl, index))}
          </div>
        )}
      </div>
    </div>
  );
}

function VideoWithOverlay({ src, index, videoRefs }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    videoRefs.current[index] = videoRef;
    return () => {
      videoRefs.current[index] = null;
    };
  }, [index, videoRefs]);

   const handlePlayPause = () => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    videoRefs.current.forEach((ref) => {
      if (ref && ref.current && ref.current !== currentVideo) {
        ref.current.pause();
      }
    });

    if (currentVideo.paused) {
      currentVideo.play().catch((err) => console.warn("Play error:", err));
    } else {
      currentVideo.pause();
    }
  };

  return (
    <div onClick={handlePlayPause} className='video-wrapp'>
      {!isPlaying && <img src={playImage} alt="Play" className='img-video' />}
      <video
        ref={videoRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        width="100%"
        style={{ borderRadius: '10px', display: 'block' }}
        controls={false}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
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

// export default function Sidebar({
//     sections,
//     selectedSections,
//     setSelectedSections,
//     shop,
//     products,
//     selectedProducts,
//     setSelectedProducts,
//     reviewInputs,
//     setReviewInputs,
//     productStyle,
//     setProductStyle,
//     setVideoInputs,
//     videoInputs
// }) {

//     const [isMounted, setIsMounted] = useState(false);
//     const [hiddenSections, setHiddenSections] = useState([]);

//     useEffect(() => {
//         fetch(`http://localhost:8000/custom-data?shop=${encodeURIComponent(shop)}`)
//             .then(res => res.json())
//             .then(data => {
//                 if (data.options) setSelectedSections(data.options);
//                 if (data.products && products) {
//                     const fullProducts = products.filter(p => data.products.includes(p.id));
//                     setSelectedProducts(fullProducts);
//                 }
//                 if (data.reviews) setReviewInputs(data.reviews);
//                 if (data.styles && data.styles.length > 0) setProductStyle(data.styles[0]);
//                 if (data.videos) {
//                     setVideoInputs({
//                         videos: data.videos.filter(v => !['grid', 'slider'].includes(v)),
//                         display: data.videos.find(v => ['grid', 'slider'].includes(v)) || 'slider',
//                         itemsPerRow: data.styles?.itemsPerRow || 2
//                     });
//                 }
//             })
//             .catch(err => console.error("Error fetching custom data:", err));
//     }, [shop]);

//     // Toggle section selected/unselected
//     const handleAddSection = (sectionName) => {
//         setSelectedSections(prev => {
//             const isSelected = prev.includes(sectionName);
//             return isSelected ? prev.filter(sec => sec !== sectionName) : [...prev, sectionName];
//         });
//     };

//     // Toggle section content show/hide
//     const handleToggleSectionContent = (section) => {
//         setHiddenSections(prev =>
//             prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
//         );
//     };

//     const isVisible = (section) =>
//         selectedSections.includes(section) && !hiddenSections.includes(section);

//     // Video handlers
//     const handleAddVideo = () => setVideoInputs(prev => ({ ...prev, videos: [...prev.videos, ""] }));

//     const handleVideoChange = (index, value) => setVideoInputs(prev => {
//         const updatedVideos = [...prev.videos];
//         updatedVideos[index] = value;
//         return { ...prev, videos: updatedVideos };
//     });

//     const handleRemoveVideo = (index) => setVideoInputs(prev => {
//         const updatedVideos = [...prev.videos];
//         updatedVideos.splice(index, 1);
//         return { ...prev, videos: updatedVideos };
//     });

//     // Ensure at least one video/review exists when section selected
//     useEffect(() => {
//         if (selectedSections.includes("review") && reviewInputs.length === 0) setReviewInputs([""]);
//         if (selectedSections.includes("video") && videoInputs.videos.length === 0) setVideoInputs(prev => ({ ...prev, videos: [""] }));
//     }, [selectedSections]);

//     // Auto send custom data on changes
//     useEffect(() => {
//         if (isMounted) sendCustomData();
//         else setIsMounted(true);
//     }, [selectedSections, selectedProducts, reviewInputs, productStyle, videoInputs]);

//     const sendCustomData = () => {
//         const payload = {
//             shop,
//             options: selectedSections,
//             reviews: reviewInputs,
//             videos: [...videoInputs.videos, videoInputs.display],
//             products: selectedProducts.map(p => p.id),
//             styles: {
//                 productStyle: productStyle, itemsPerRow: videoInputs.itemsPerRow
//             }
//         };

//         console.log("🟡 Payload being sent:", JSON.stringify(payload, null, 2));

//         fetch('http://localhost:8000/custom-data', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         })
//             .then(res => res.json())
//             .then(data => console.log("📤 Sent:", data))
//             .catch(err => console.error("❌ Error sending data:", err));
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
//                             ) : sections.map((section, idx) => (
//                                 <li key={idx} className="slide-bar-wraper">
//                                     <div className="slide-bar-wraper-items ">
//                                         <div className="slide-bar-wraper-checkout-pagess">
//                                             <input
//                                                 type="checkbox"
//                                                 className="custom-checkbox"
//                                                 checked={selectedSections.includes(section)}
//                                                 onChange={() => handleAddSection(section)}
//                                             />
//                                             <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
//                                         </div>
//                                         {selectedSections.includes(section) && (
//                                             hiddenSections.includes(section) ? (
//                                                 <img src={down} alt="Show" onClick={() => handleToggleSectionContent(section)} style={{ cursor: "pointer" }} />
//                                             ) : (
//                                                 <img src={arrowuper} alt="Hide" onClick={() => handleToggleSectionContent(section)} style={{ cursor: "pointer" }} />
//                                             )
//                                         )}
//                                     </div>

//                                     {/* Video Section */}
//                                     {section === "video" && isVisible("video") && (
//                                         <div className="add-reviews-section">
//                                             <div className="add-review-header">
//                                                 <div className="checkout-page-starr">
//                                                     <img src={video} alt="" />
//                                                     <h3>Add Video:</h3>
//                                                 </div>
//                                                 <div className='option-img' onClick={handleAddVideo} style={{ cursor: 'pointer' }}>
//                                                     <img src={plusicon} alt="Add" />
//                                                 </div>
//                                             </div>

//                                             {videoInputs.videos.map((videoUrl, index) => (
//                                                 <div className='review-items' key={index}>
//                                                     <input
//                                                         type="text"
//                                                         value={videoUrl}
//                                                         onChange={(e) => handleVideoChange(index, e.target.value)}
//                                                     />
//                                                     <button className='remove-btn' onClick={() => handleRemoveVideo(index)} style={{ cursor: 'pointer' }}>
//                                                         <img src={deletebtn} alt="Remove" />
//                                                     </button>
//                                                 </div>
//                                             ))}

//                                             <div style={{ marginBottom: '10px' }}>
//                                                 <label>Display type: </label>
//                                                 <select
//                                                     value={videoInputs.display || 'slider'}
//                                                     onChange={(e) => setVideoInputs(prev => ({ ...prev, display: e.target.value }))}
//                                                 >
//                                                     <option value="slider">Slider</option>
//                                                     <option value="grid">Grid</option>
//                                                 </select>
//                                             </div>

//                                             {videoInputs.display === "grid" && (
//                                                 <div style={{ marginTop: '5px' }}>
//                                                     <label>Items per row:</label>
//                                                     <select
//                                                         value={videoInputs.itemsPerRow || 2}
//                                                         onChange={(e) => setVideoInputs(prev => ({ ...prev, itemsPerRow: Number(e.target.value) }))}
//                                                     >
//                                                         <option value={1}>1</option>
//                                                         <option value={2}>2</option>
//                                                         <option value={3}>3</option>
//                                                         <option value={4}>4</option>
//                                                     </select>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }







// import { useRef, useState, useEffect } from 'react';
// import playImage from '../../../images/videobtn.png';
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from 'swiper/modules';

// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import plus from '../../../images/plusslider.png';
// import right from '../../../images/right.png';
// import left from '../../../images/left.png';
// import axios from 'axios';

// export default function ReviewVideo({ videoInputs, }) {
//   const [swiperInstance, setSwiperInstance] = useState(null);
//   const [isBeginning, setIsBeginning] = useState(true);
//   const [isEnd, setIsEnd] = useState(false);
//   const videoRefs = useRef([]);
  
//   const isYouTubeOrVimeo = (url) =>
//     /youtube\.com|youtu\.be|vimeo\.com/.test(url);

//   const getYouTubeEmbedUrl = (url) => {
//     const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
//     return match ? `https://www.youtube.com/embed/${match[1]}` : '';
//   };

//   const getVimeoEmbedUrl = (url) => {
//     const match = url.match(/vimeo\.com\/(\d+)/);
//     return match ? `https://player.vimeo.com/video/${match[1]}` : '';
//   };

//   const filteredVideos = videoInputs?.videos?.filter((url) => url.trim() !== '');
//   const productStyle = videoInputs?.display || "slider";
//   const itemsPerRow = videoInputs?.itemsPerRow || 2;
//   const videoHeading = videoInputs?.heading || 'Videos';

//   const handleSlideChange = (swiper) => {
//     setIsBeginning(swiper.isBeginning);
//     setIsEnd(swiper.isEnd);
//   };

//   const handleSwiper = (swiper) => {
//     setSwiperInstance(swiper);
//     swiper.update();
//     setIsBeginning(swiper.isBeginning);
//     setIsEnd(swiper.isEnd);
//   };

//   useEffect(() => {
//     if (swiperInstance) {
//       swiperInstance.update();
//       setIsBeginning(swiperInstance.isBeginning);
//       setIsEnd(swiperInstance.isEnd);
//     }
//   }, [swiperInstance, videoInputs]);

//   const showNavButtons = filteredVideos?.length > 2;

//   const renderVideo = (videoUrl, index) => {
//     if (isYouTubeOrVimeo(videoUrl)) {
//       const embedUrl = videoUrl.includes('youtube')
//         ? getYouTubeEmbedUrl(videoUrl)
//         : getVimeoEmbedUrl(videoUrl);

//       return (
//         <div key={index} className="video-item" style={{ marginBottom: '20px' }}>
//           <iframe
//             width="100%"
//             height="315"
//             src={embedUrl}
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           ></iframe>
//         </div>
//       );
//     }

//     return <VideoWithOverlay key={index} src={videoUrl} index={index} />;
//   };


//   return (
//     <div className="checkout-product-rating-reivew  video sidebar-checkbox ">
//       <h3 className="video-heading">{videoHeading}</h3>
//       <div className="related-products slider-wrapper">
//         {productStyle === "slider" ? (
//           <div className="related-products-slider-items-reviews">
//             <div className="swiper-nav-buttons">
//               <button
//                 className="swiper-button-prev-custom"
//                 onClick={() => swiperInstance?.slidePrev()}
//               >
//                 <img src={left} alt="Previous" className="nav-img" />
//               </button>
//               <button
//                 className="swiper-button-next-custom"
//                 onClick={() => swiperInstance?.slideNext()}
//               >
//                 <img src={right} alt="Next" className="nav-img" />
//               </button>
//             </div>

//             <Swiper
//               onSwiper={handleSwiper}
//               onSlideChange={handleSlideChange}
//               spaceBetween={16}
//               slidesPerView={3}
//               modules={[Navigation]}
//               breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 } }}
//             >
//               {filteredVideos.map((videoUrl, index) => (
//                 <SwiperSlide key={index}>
//                   {renderVideo(videoUrl, index)}
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>
//         ) : (
//           <div
//             className="related-products-list line-view review videos"
//             style={{
//               display: "grid",
//               gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
//               gap: "16px",
//             }}
//           >
//             {filteredVideos.map((videoUrl, index) => renderVideo(videoUrl, index))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const videoRefs = [];

// function VideoWithOverlay({ src, index }) {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     videoRefs[index] = videoRef;
//     return () => {
//       videoRefs[index] = null;
//     };
//   }, [index]);

//   const handlePlayPause = () => {
//     const currentVideo = videoRef.current;
//     if (!currentVideo) return;

//     if (currentVideo.paused) {
//       videoRefs.forEach((ref, i) => {
//         if (ref && i !== index && !ref.current.paused) {
//           ref.current.pause();
//         }
//       });

//       setTimeout(() => {
//         currentVideo.play().catch(err => {
//           console.warn("Video play interrupted:", err);
//         });
//       }, 50);
//     } else {
//       currentVideo.pause();
//     }
//   };

//   return (
//     <div onClick={handlePlayPause} className='video-wrapp'>
//       {!isPlaying && <img src={playImage} alt="Play" className='img-video' />}
//       <video
//         ref={videoRef}
//         onPlay={() => setIsPlaying(true)}
//         onPause={() => setIsPlaying(false)}
//         width="100%"
//         style={{ borderRadius: '10px', display: 'block' }}
//         controls={false}
//       >
//         <source src={src} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//     </div>
//   );
// }

