import React from "react";
import PortfolioOne from "./PortfolioOne";

const PortfolioSection = ({ title = "Selected Works", viewAllLink = "/portfolio" }) => {
  return (
    <section className="works position-relative p-0">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* Intro */}
            <div className="intro d-flex justify-content-between align-items-center">
              <h3 className="title">{title}</h3>
              <a
                className="btn btn-outline content-btn swap-icon portfolio-view-all-glow"
                href={viewAllLink}
              >
                View All <i className="icon bi bi-arrow-right-short"></i>
              </a>
            </div>
          </div>
        </div>
        {/* PortfolioOne Component */}
        <PortfolioOne />
      </div>
      <style>{`
        @keyframes portfolioViewAllGlowPulse {
          0%,
          100% {
            border-color: rgba(0, 0, 0, 0.28);
            box-shadow:
              0 0 0 1px rgba(0, 0, 0, 0.03) inset,
              0 0 14px rgba(0, 0, 0, 0.08),
              0 0 28px rgba(0, 0, 0, 0.04);
          }

          50% {
            border-color: rgba(0, 0, 0, 0.44);
            box-shadow:
              0 0 0 1px rgba(0, 0, 0, 0.06) inset,
              0 0 18px rgba(0, 0, 0, 0.14),
              0 0 38px rgba(0, 0, 0, 0.08);
          }
        }

        .portfolio-view-all-glow {
          position: relative;
          animation: portfolioViewAllGlowPulse 2.8s ease-in-out infinite;
        }

        .portfolio-view-all-glow:hover {
          border-color: rgba(0, 0, 0, 0.52);
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.06) inset,
            0 0 18px rgba(0, 0, 0, 0.14),
            0 0 36px rgba(0, 0, 0, 0.08);
        }

        body.odd .portfolio-view-all-glow {
          animation: portfolioViewAllGlowPulseDark 2.8s ease-in-out infinite;
        }

        @keyframes portfolioViewAllGlowPulseDark {
          0%,
          100% {
            border-color: rgba(255, 255, 255, 0.34);
            box-shadow:
              0 0 0 1px rgba(255, 255, 255, 0.04) inset,
              0 0 14px rgba(255, 255, 255, 0.08),
              0 0 28px rgba(255, 255, 255, 0.04);
          }

          50% {
            border-color: rgba(255, 255, 255, 0.56);
            box-shadow:
              0 0 0 1px rgba(255, 255, 255, 0.08) inset,
              0 0 18px rgba(255, 255, 255, 0.14),
              0 0 38px rgba(255, 255, 255, 0.08);
          }
        }

        body.odd .portfolio-view-all-glow:hover {
          border-color: rgba(255, 255, 255, 0.65);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            0 0 18px rgba(255, 255, 255, 0.14),
            0 0 36px rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </section>
  );
};

export default PortfolioSection;
