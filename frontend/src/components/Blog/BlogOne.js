import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { transformMediaUrl } from '../../utils/mediaUrl';
import { getApiBaseUrl } from '../../utils/apiBaseUrl';

const BlogOne = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const baseUrl = getApiBaseUrl();
        // Fetch data from the API when the component mounts
        axios.get(`${baseUrl}/blogs?limit=3`)
        .then(response => {
            setBlogs(response.data.reverse());
        })
        .catch(error => {
            console.error("There was an error fetching the blog data!", error);
            // Optionally, handle error state here if needed
        })
        .finally(() => {
            setIsLoading(false); // Set loading to false after fetch attempt
        });
    }, []);

    useEffect(() => {
        setActiveIndex(0);
    }, [blogs.length]);

    const handleMobileScroll = (event) => {
        const container = event.currentTarget;
        const firstSlide = container.querySelector(".insight-slide");

        if (!firstSlide) return;

        const slideWidth = firstSlide.getBoundingClientRect().width;
        const gap = 20;
        const nextIndex = Math.round(container.scrollLeft / (slideWidth + gap));

        setActiveIndex(Math.max(0, Math.min(nextIndex, blogs.length - 1)));
    };

    const handleDotClick = (index) => {
        const container = scrollContainerRef.current;
        const slide = container?.querySelectorAll(".insight-slide")[index];

        if (!container || !slide) return;

        container.scrollTo({
            left: slide.offsetLeft,
            behavior: "smooth",
        });
        setActiveIndex(index);
    };

    // If still loading, you might want to return null or a loading indicator
    if (isLoading) {
        return null; // Or <p>Loading blogs...</p>;
    }

    // If no blogs are fetched and not loading, render nothing
    if (blogs.length === 0) {
        return (
            <div className="row items">
                <div className="col-12 text-center">
                    <p>Blogs coming soon...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                ref={scrollContainerRef}
                className="row items insights-mobile-scroll"
                onScroll={handleMobileScroll}
            >
                {blogs.map((blog, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-4 item insight-slide">
                        {/* Blog Post */}
                        <div className="card blog-item">
                            <div className="image-holder">
                                {/* Card Thumbnail */}
                                <a className="card-thumb" href={blog.link} target="_blank" rel="noopener noreferrer">
                                    <picture>
                                        <img
                                        src={transformMediaUrl(blog.image, {width: 768, height: 1024, crop: true, quality: 80, format: "auto"})}
                                        alt={blog.title}
                                        />
                                    </picture>
                                </a>
                                <div className="card-overlay top fade-down">
                                    <div className="logo">
                                        <img src="/img/favicon.ico" alt="Logo" width={'55vw'}/>
                                    </div>
                                    <div className="post-meta d-flex flex-column ms-3">
                                        <span>Posted by</span>
                                        <span className="post-author"><strong>{blog.author}</strong></span>
                                    </div>
                                </div>
                            </div>
                            {/* Card Content */}
                            <div className="card-content mt-3">
                                <div className="heading">
                                    <div className="post-meta d-flex">
                                        <span className="post-date">
                                            <i className="bi bi-clock me-1"></i>{blog.date}
                                        </span>
                                    </div>
                                    <h4 className="title my-2">
                                        <a href={blog.link} target="_blank" rel="noopener noreferrer">{blog.title}</a>
                                    </h4>
                                    <div className="card-terms" >
                                        {blog.categories.map((category, categoryIndex) => (
                                            <a key={categoryIndex} className="terms badge" href="/blog" >{category}</a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {blogs.length > 1 && (
                <div className="insights-mobile-dots" aria-label="Insight slides">
                    {blogs.map((blog, index) => (
                        <button
                            key={`${blog.title}-${index}`}
                            type="button"
                            className={`insights-dot ${index === activeIndex ? "active" : ""}`}
                            aria-label={`Go to insight ${index + 1}`}
                            onClick={() => handleDotClick(index)}
                        />
                    ))}
                </div>
            )}

            <style>{`
                .insights-mobile-dots {
                    display: none;
                }

                @media (max-width: 767px) {
                    .insights-mobile-scroll {
                        display: flex;
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        overflow-y: hidden;
                        gap: 20px;
                        margin-left: 0;
                        margin-right: 0;
                        padding-bottom: 8px;
                        scroll-snap-type: x mandatory;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                    }

                    .insights-mobile-scroll::-webkit-scrollbar {
                        display: none;
                    }

                    .insights-mobile-scroll .insight-slide {
                        flex: 0 0 100%;
                        min-width: 100%;
                        max-width: 100%;
                        padding-left: 0;
                        padding-right: 0;
                        scroll-snap-align: start;
                    }

                    .insights-mobile-dots {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 8px;
                        margin-top: 14px;
                    }

                    .insights-dot {
                        width: 8px;
                        height: 8px;
                        border: 0;
                        border-radius: 999px;
                        padding: 0;
                        background: rgba(0, 0, 0, 0.26);
                        transition: all 0.25s ease;
                    }

                    .insights-dot.active {
                        width: 22px;
                        background: rgba(0, 0, 0, 0.88);
                    }

                    body.odd .insights-dot {
                        background: rgba(255, 255, 255, 0.28);
                    }

                    body.odd .insights-dot.active {
                        background: rgba(255, 255, 255, 0.92);
                    }
                }
            `}</style>
        </>
    );
};

export default BlogOne;
