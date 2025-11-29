import React, { useEffect, useState } from "react";
import MagneticButton from "../Miscellaneous/MagneticButton";
import Lottie from "lottie-react";
import fireAnimationData from "../../assets/fire.json";
import emoji2AnimationData from "../../assets/emoji2.json";
import light2AnimationData from "../../assets/light2.json";
import { useProfile } from "../../context/profileContext";
import "./Hero.scss";

const Hero = ({
  title = "Crafting bold experiences through",
  highlightedText = "design & code.",
  buttonText = "Let's Talk!",
  isLightTheme = false, // pass true for light theme, false for dark
}) => {
  const { profile } = useProfile();
  const [introText, setIntroText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");

  useEffect(() => {
    if (profile?.name) {
      setIntroText(`${profile?.name || "prithbidesigns"}`);
    }
    if (profile?.description) {
      setDescriptionText(
        `${
          profile?.description ||
          "I transform ideas into impactful digital experiences, delivering innovative solutions that elevate brands and captivate audiences around the world"
        }`
      );
    }
  }, [profile]);

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* Hero Content */}
            <div className="hero-content">
              <span className="intro-text">Hello! I’m {introText}</span>

              {/* Original Headline with Lottie Overlay */}
              <div className="hero-headline-container">
                <h1 className="title section-title mt-3 mt-md-4 mb-md-5">
                  {title} <span>{highlightedText}</span>
                </h1>

                {/* Lottie Emoji Wrapper */}
                <div className="hero-emoji-wrapper">
                  <div className="hero-emoji-1">
                    <Lottie
                      animationData={light2AnimationData}
                      loop={true}
                      autoplay={true}
                      renderer="svg"
                      className="svg-lottie hover"
                    />
                  </div>
                  <div className="hero-emoji-2">
                    <Lottie
                      animationData={fireAnimationData}
                      loop={true}
                      autoplay={true}
                      renderer="svg"
                      className="svg-lottie hover"
                    />
                  </div>
                  <div className="hero-emoji-3">
                    <Lottie
                      animationData={emoji2AnimationData}
                      loop={true}
                      autoplay={true}
                      renderer="svg"
                      className="svg-lottie hover"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="content d-flex flex-column flex-md-row justify-content-md-between">
                <div className="hero-button order-last order-md-first mt-4 mt-md-0">
                  <MagneticButton href="/contact">{buttonText}</MagneticButton>
                </div>
                <p className="sub-title order-first order-md-last">{descriptionText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Background Lines/Drops */}
      <div className={`hero-bg-line ${isLightTheme ? "light" : "dark"}`}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-line"
            style={{
              "--delay": `${i * 1.2}s`, // stagger drops for continuous animation
              "--left-pos": `${10 + i * 16}%`,
            }}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
