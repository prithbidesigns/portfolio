import React, {useEffect, useRef, useState} from 'react';
import { useProfile } from '../../context/profileContext';
import Preloader from '../Miscellaneous/Preloader';

const Services = () => {
    const { profile, loader } = useProfile();
    const [services, setServices] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (loader) return <Preloader />;
        if (profile && profile.services && profile.services.length > 0) {
            setServices(profile.services[0].serviceItem || []);
        }
    }, [profile, loader]);

    useEffect(() => {
        setActiveIndex(0);
    }, [services.length]);

    const handleMobileScroll = (event) => {
        const container = event.currentTarget;
        const firstSlide = container.querySelector(".service-slide");

        if (!firstSlide) return;

        const slideWidth = firstSlide.getBoundingClientRect().width;
        const gap = 24;
        const nextIndex = Math.round(container.scrollLeft / (slideWidth + gap));

        setActiveIndex(Math.max(0, Math.min(nextIndex, services.length - 1)));
    };

    const handleDotClick = (index) => {
        const container = scrollContainerRef.current;
        const slide = container?.querySelectorAll(".service-slide")[index];

        if (!container || !slide) return;

        container.scrollTo({
            left: slide.offsetLeft,
            behavior: "smooth",
        });
        setActiveIndex(index);
    };

    return (
        <>
            <div
                ref={scrollContainerRef}
                className="row service-wrapper items mt-md-5 services-mobile-scroll"
                onScroll={handleMobileScroll}
            >
                {services.map((service, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-4 service-slide">
                        <div className="item d-flex align-items-start">
                            <div className="item-count">0{index+1}</div>
                            <div className="content">
                                <h4 className="mt-0">
                                    {service.title === "Web Development" ? (
                                        <>
                                            Web
                                            <br />
                                            Development
                                        </>
                                    ) : (
                                        service.title
                                    )}
                                </h4>
                                <p>{service.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {services.length > 1 && (
                <div className="services-mobile-dots" aria-label="Service slides">
                    {services.map((service, index) => (
                        <button
                            key={`${service.title}-${index}`}
                            type="button"
                            className={`services-dot ${index === activeIndex ? "active" : ""}`}
                            aria-label={`Go to service ${index + 1}`}
                            onClick={() => handleDotClick(index)}
                        />
                    ))}
                </div>
            )}

            <style>{`
                .services-mobile-dots {
                    display: none;
                }

                @media (max-width: 767px) {
                    .services-mobile-scroll {
                        display: flex;
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        overflow-y: hidden;
                        gap: 24px;
                        margin-left: 0;
                        margin-right: 0;
                        padding-bottom: 8px;
                        padding-left: 0;
                        padding-right: 0;
                        scroll-snap-type: x mandatory;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .services-mobile-scroll::-webkit-scrollbar {
                        display: none;
                    }

                    .services-mobile-scroll .service-slide {
                        flex: 0 0 100%;
                        min-width: 100%;
                        max-width: 100%;
                        padding-left: 0;
                        padding-right: 0;
                        scroll-snap-align: start;
                        overflow: hidden;
                    }

                    .services-mobile-scroll .service-slide .item {
                        width: 100%;
                    }

                    .services-mobile-scroll .service-slide .content,
                    .services-mobile-scroll .service-slide .content h4,
                    .services-mobile-scroll .service-slide .content p {
                        text-align: left;
                    }

                    .services-mobile-dots {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 8px;
                        margin-top: 14px;
                    }

                    .services-dot {
                        width: 8px;
                        height: 8px;
                        border: 0;
                        border-radius: 999px;
                        padding: 0;
                        background: rgba(0, 0, 0, 0.26);
                        transition: all 0.25s ease;
                    }

                    .services-dot.active {
                        width: 22px;
                        background: rgba(0, 0, 0, 0.88);
                    }

                    body.odd .services-dot {
                        background: rgba(255, 255, 255, 0.28);
                    }

                    body.odd .services-dot.active {
                        background: rgba(255, 255, 255, 0.92);
                    }
                }
            `}</style>
        </>
    );
};

export default Services;
