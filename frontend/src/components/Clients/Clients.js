import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiBaseUrl } from '../../utils/apiBaseUrl';
import { transformMediaUrl } from '../../utils/mediaUrl';

const Clients = () => {
    const [clientLogos, setClientLogos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const baseUrl = getApiBaseUrl();

        const fetchClients = (retriesLeft) => {
            axios
                .get(`${baseUrl}/clients`, { timeout: 20000 })
                .then((response) => {
                    setClientLogos(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching Clients data:", err);
                    // The free backend host can take 30-50s to wake up from idle,
                    // so a cold start looks like a timeout/network error on first load.
                    if (retriesLeft > 0) {
                        setTimeout(() => fetchClients(retriesLeft - 1), 8000);
                    } else {
                        setError("Failed to load client logos.");
                        setLoading(false);
                    }
                });
        };

        fetchClients(3);
    }, []);

    // --- Conditional Rendering to turn off the section ---
    if (loading) {
        return <div className="text-center p-3">Loading clients...</div>;
    }

    // If loading permanently failed or there's no data, hide the section
    // rather than showing a visible error to site visitors.
    if (error || !clientLogos || clientLogos.length === 0) {
        return null;
    }

    // --- If we have data, render the marquee ---
    return (
        <div className="marquee client-marquee-gap-fix">
            <ul className="list-unstyled">
                {/* Render original items */}
                {clientLogos.map((client, index) => (
                    <li key={client._id || index} className="item">
                        <a
                            href={client.link || "/about"}
                            className="marquee-item rounded"
                            target={client.link ? "_blank" : "_self"}
                            rel={client.link ? "noopener noreferrer" : ""}
                        >
                            <div className="marquee-content">
                                <img
                                    src={transformMediaUrl(client.clientImage, {
                                        width: 320,
                                        quality: 80,
                                        format: "auto",
                                    })}
                                    alt={client.name || `Brand ${index + 1}`}
                                />
                            </div>
                        </a>
                    </li>
                ))}
                {/* *** CRUCIAL FIX FOR SEAMLESS LOOP ***
                  Duplicate the items here. The CSS animation "translateX(-50%)"
                  relies on having a copy of the content immediately following the original.
                */}
                {clientLogos.map((client, index) => (
                    <li key={`duplicate-${client._id || index}`} className="item">
                        <a
                            href={client.link || "/about"}
                            className="marquee-item rounded"
                            target={client.link ? "_blank" : "_self"}
                            rel={client.link ? "noopener noreferrer" : ""}
                        >
                            <div className="marquee-content">
                                <img
                                    src={transformMediaUrl(client.clientImage, {
                                        width: 320,
                                        quality: 80,
                                        format: "auto",
                                    })}
                                    alt={client.name || `Brand ${index + 1}`}
                                />
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
            <style>{`
                .client-marquee-gap-fix {
                    padding-bottom: 0;
                }

                .client-marquee-gap-fix ul .item {
                    height: 140px;
                }

                .client-marquee-gap-fix ul .item .marquee-item .marquee-content {
                    width: 140px;
                    height: 140px;
                }

                @media (max-width: 575px) {
                    .client-marquee-gap-fix {
                        padding-bottom: 0;
                    }

                    .client-marquee-gap-fix ul .item {
                        height: 140px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Clients;
