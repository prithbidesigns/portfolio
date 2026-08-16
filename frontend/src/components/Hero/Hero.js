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
}) => {
  const { profile } = useProfile();
  const [introText, setIntroText] = useState("");

  const [isLightTheme, setIsLightTheme] = useState(true);

useEffect(() => {
  // 1️⃣ Read theme from localStorage on first load
  const savedTheme = localStorage.getItem("isDarkMode");

  if (savedTheme !== null) {
    // localStorage stores strings → "true" or "false"
    const isDark = savedTheme === "true";
    setIsLightTheme(!isDark);

    // also ensure body class matches stored theme
    if (isDark) {
      document.body.classList.add("odd");
    } else {
      document.body.classList.remove("odd");
    }
  } else {
    // 2️⃣ Fallback: detect from body class if localStorage missing
    const isDarkBody = document.body.classList.contains("odd");
    setIsLightTheme(!isDarkBody);
  }

  // 3️⃣ Watch for theme class changes (toggle button updates body)
  const updateTheme = () => {
    const isDark = document.body.classList.contains("odd");
    setIsLightTheme(!isDark);

    // sync back to localStorage
    localStorage.setItem("isDarkMode", isDark.toString());
  };

  const observer = new MutationObserver(updateTheme);

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observer.disconnect();
}, []);


  useEffect(() => {
    if (profile?.name) {
      setIntroText(`${profile?.name || "prithbidesigns"}`);
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
              <div className="content d-flex flex-column flex-md-row hero-cta-row">
                <div className="hero-button order-last order-md-first mt-4 mt-md-0 hero-button-explore-wrap">
                  <span className="status-badge status-badge-cta">
                    <span className="status-badge-dot" />
                    Currently building AveQue — creative &amp; ad automation
                  </span>
                  <MagneticButton
                    href="https://aveque.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-button-aveque"
                  >
                    Explore aveque.io
                  </MagneticButton>
                </div>
                <div className="hero-button order-first order-md-last hero-button-letstalk-wrap">
                  <MagneticButton href="mailto:prithbidesigns@gmail.com" className="hero-button-letstalk">{buttonText}</MagneticButton>
                </div>
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
