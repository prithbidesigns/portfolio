import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getVideoPosterUrl, transformMediaUrl } from "../../utils/mediaUrl";
import "./portfolio.css";
import { getApiBaseUrl } from "../../utils/apiBaseUrl";

// Import react-slick and its styles
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ArrowIcon = ({ direction }) => {
  const isNext = direction === "next";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      style={{
        display: "block",
        transform: isNext ? "translateX(1px)" : "translateX(-1px)",
      }}
    >
      <path
        d={isNext ? "M4 10H13M10 6L14 10L10 14" : "M16 10H7M10 6L6 10L10 14"}
        fill="none"
        stroke="#222222"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Custom Next Arrow Component
const NextArrow = ({ className, style, onClick, isDarkMode }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        right: "25px",
        zIndex: 1,
        background: "#ffffff",
        border: "1px solid rgba(255, 255, 255, 0.95)",
        boxShadow: "0 8px 18px rgba(0, 0, 0, 0.22)",
        borderRadius: "50%",
        height: "42px",
        width: "42px",
        lineHeight: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
      }}
      onClick={onClick}
    >
      <ArrowIcon direction="next" />
    </div>
  );
};

// Custom Previous Arrow Component
const PrevArrow = ({ className, style, onClick, isDarkMode }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        left: "25px",
        zIndex: 1,
        background: "#ffffff",
        border: "1px solid rgba(255, 255, 255, 0.95)",
        boxShadow: "0 8px 18px rgba(0, 0, 0, 0.22)",
        borderRadius: "50%",
        height: "42px",
        width: "42px",
        lineHeight: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
      }}
      onClick={onClick}
    >
      <ArrowIcon direction="prev" />
    </div>
  );
};

const PortfolioSingleSection = () => {
  const [portfolio, setPortfolio] = useState(null);
  const { projectId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryContainerRef = useRef(null);
  const lightboxContentRef = useRef(null);

  const openViewer = (index) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const pauseGalleryVideos = useCallback(() => {
    const galleryVideos =
      galleryContainerRef.current?.querySelectorAll("video") || [];

    galleryVideos.forEach((video) => {
      video.pause();
    });
  }, []);

  const closeViewer = useCallback(() => {
    pauseGalleryVideos();
    const lightboxVideos =
      lightboxContentRef.current?.querySelectorAll("video") || [];
    lightboxVideos.forEach((video) => video.pause());
    setIsOpen(false);
  }, [pauseGalleryVideos]);

  const pauseLightboxVideos = useCallback((exceptVideo = null) => {
    const lightboxVideos =
      lightboxContentRef.current?.querySelectorAll("video") || [];

    lightboxVideos.forEach((video) => {
      if (video === exceptVideo) return;
      video.pause();
    });
  }, []);

  const playCurrentLightboxVideo = useCallback(() => {
    const currentVideo =
      lightboxContentRef.current?.querySelector(".slick-current video");

    if (!currentVideo) return;

    pauseLightboxVideos(currentVideo);
    const playPromise = currentVideo.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  }, [pauseLightboxVideos]);

  const handleLightboxVideoPlay = (event) => {
    pauseGalleryVideos();
    pauseLightboxVideos(event.currentTarget);
  };


  useEffect(() => {
    const baseUrl = getApiBaseUrl();
    axios
      .get(`${baseUrl}/projects/${projectId}`)
      .then((res) => setPortfolio(res.data))
      .catch((err) => console.error(err));
  }, [projectId]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      pauseLightboxVideos();
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeViewer();
      }
    };

    document.body.style.overflow = "hidden";
    pauseGalleryVideos();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeViewer, isOpen, pauseGalleryVideos, pauseLightboxVideos]);

  const galleryItems = useMemo(() => {
    if (!portfolio?.gallery || portfolio.gallery.length === 0) return [];

    return portfolio.gallery.map((item) => ({
      url: item.url,
      thumbnail: getVideoPosterUrl(item.url, item.thumbnail || item.url),
      isVideo: item.url.endsWith(".mp4") || item.url.includes("video"),
    }));
  }, [portfolio]);

  useEffect(() => {
    if (!isOpen) return;

    const activeItem = galleryItems[activeIndex];
    pauseLightboxVideos();
    if (!activeItem?.isVideo) return undefined;

    const frame = window.requestAnimationFrame(() => {
      playCurrentLightboxVideo();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, galleryItems, isOpen, pauseLightboxVideos, playCurrentLightboxVideo]);

  if (!portfolio) return <p>Loading...</p>;
  const itemCount = galleryItems.length;
  const sliderSettings = {
    className: "slider variable-width",
    dots: true,
    infinite: itemCount > 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: itemCount > 1,
    centerMode: itemCount > 1,
    centerPadding: "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    variableWidth: itemCount > 1,
    lazyLoad: "ondemand",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: itemCount > 1,
          centerPadding: itemCount > 1 ? "44px" : "0px",
          variableWidth: false,
          arrows: false,
          infinite: itemCount > 1,
        },
      },
    ],
  };
  const modalSliderSettings = {
    initialSlide: activeIndex,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: itemCount > 1,
    arrows: itemCount > 1,
    dots: false,
    swipe: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    adaptiveHeight: true,
    lazyLoad: "ondemand",
    beforeChange: () => pauseLightboxVideos(),
    afterChange: (current) => {
      setActiveIndex(current);
      window.requestAnimationFrame(() => {
        playCurrentLightboxVideo();
      });
    },
  };

  return (
    <section className="content">
      <div className="container">
        <div className="portfolio-meta d-flex align-items-center">
          {portfolio.categories?.length > 0 && (
            <div className="portfolio-terms">
              {portfolio.categories.map((cat, idx) => (
                <label key={idx} className="terms">
                  {cat.toUpperCase()}
                </label>
              ))}
            </div>
          )}
          {portfolio.date && <span className="date">{portfolio.date}</span>}
        </div>
        {/* Portfolio Gallery */}
        <div
          ref={galleryContainerRef}
          className="portfolio-gallery mt-4"
          style={{padding: "20px" }}
        >
          <Slider {...sliderSettings}>
            {galleryItems.map((item, idx) => (
              <div key={idx}>
                <button
                  type="button"
                  className="gallery-item-style gallery-item-trigger"
                  onClick={() => openViewer(idx)}
                  aria-label={
                    item.isVideo
                      ? `Open reel ${idx + 1} in full view`
                      : `Open image ${idx + 1} in full view`
                  }
                >
                  {item.isVideo ? (
                    <>
                      <img
                        src={item.thumbnail}
                        alt={`reel-${idx}`}
                        loading="lazy"
                      />
                      <span className="gallery-play-badge" aria-hidden="true">
                        <i className="bi bi-play-fill"></i>
                      </span>
                    </>
                  ) : (
                    <img
                      src={transformMediaUrl(item.url, { height: 600 })}
                      alt={`slide-${idx}`}
                      loading="lazy"
                    />
                  )}
                </button>
              </div>
            ))}
          </Slider>
        </div>
        {/* ... Portfolio Info section remains unchanged ... */}
        <div className="row justify-content-between">
          <h2>{portfolio.title}
                        {portfolio.liveSite && portfolio.liveSite !== "#" && (
                <a
                  className="nav-link d-inline-flex swap-icon ms-4"
                  href={portfolio.liveSite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Site <i className="icon bi bi-arrow-right-short"></i>
                </a>
            )}
          </h2>
          <div className="col-12 col-lg-5">
            <div className="heading">
              {portfolio.description && <p>{portfolio.description}</p>}
            </div>
          </div>
          <div className="col-12 col-lg-6 items portfolio-meta mt-3 mt-md-0">
            {portfolio.task && (
              <div className="task">
                <h6 className="title mb-3">Task</h6>
                <p className="details">{portfolio.task}</p>
              </div>
            )}
            <div className="content item d-flex flex-column flex-md-row justify-content-between">
              {portfolio.role?.length > 0 && (
                <div className="role">
                  <h6 className="title mt-0 mb-1 mb-md-3">Role/Services</h6>
                  <div className="portfolio-terms">
                    {portfolio.role.map((role, idx) => (
                      <label key={idx} className="terms">
                        {role}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {portfolio.client && (
                <div className="client my-3 my-md-0">
                  <h6 className="title mt-0 mb-1 mb-md-3">Client</h6>
                  <span>{portfolio.client}</span>
                </div>
              )}
              {portfolio.categoryYear && (
                <div className="category">
                  <h6 className="title mt-0 mb-1 mb-md-3">Category & Year</h6>
                  <span>{portfolio.categoryYear}</span>
                </div>
              )}
            </div>
            {/* {portfolio.liveSite && portfolio.liveSite !== "#" && (
              <div className="socials item">
                <a
                  className="nav-link d-inline-flex swap-icon ms-0"
                  href={portfolio.liveSite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Site <i className="icon bi bi-arrow-right-short"></i>
                </a>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* View All Button */}
      <div className="align-items-center mt-5 justify-content-center d-flex">
        <a className="btn btn-outline content-btn swap-icon" href="/portfolio">
          View All <i className="icon bi bi-arrow-right-short"></i>
        </a>
      </div>
      {isOpen && (
        <div
          className="lightbox-overlay"
          onClick={closeViewer}
          role="dialog"
          aria-modal="true"
          aria-label={`${portfolio.title} media viewer`}
        >
          <div
            ref={lightboxContentRef}
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={closeViewer}
              aria-label="Close media viewer"
            >
              <i className="bi bi-x-lg"></i>
            </button>
            <Slider {...modalSliderSettings}>
              {galleryItems.map((item, idx) => (
                <div key={idx} className="lightbox-slide">
                  {item.isVideo ? (
                    <video
                      src={item.url}
                      controls
                      autoPlay={idx === activeIndex}
                      playsInline
                      poster={item.thumbnail}
                      onPlay={handleLightboxVideoPlay}
                    />
                  ) : (
                    <img src={item.url} alt={`preview-${idx}`} />
                  )}
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioSingleSection;
