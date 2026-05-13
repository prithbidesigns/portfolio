import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { menuItems } from "./menuConfig";
import { useProfile } from "../../context/profileContext";
import Preloader from "../Miscellaneous/Preloader";
import { transformMediaUrl } from "../../utils/mediaUrl";

const Header = () => {
  const location = useLocation();
  const { profile, loader } = useProfile();
  const [logoLight, setLogoLight] = useState("/img/logo-light.png");
  const [logoDark, setLogoDark] = useState("/img/logo-dark.png");
  const [dynamicMenu, setDynamicMenu] = useState(menuItems);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const storedDarkMode = localStorage.getItem("isDarkMode");
      // If storedDarkMode is 'true', return true; if 'false', return false; otherwise default to true
       if (storedDarkMode === null) {
      return true;
    }

    return JSON.parse(storedDarkMode);
    } catch (error) {
      console.error("Failed to read isDarkMode from localStorage:", error);
      return true; // Fallback to dark
    }
  });

  const toggleDarkMode = (e) => {
    e.preventDefault(); // Prevents default link behavior
    setIsDarkMode((prevMode) => !prevMode); // Use functional update for state
  };

  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add("odd");
    } else {
      body.classList.remove("odd");
    }
    // Save the current dark mode state to localStorage
    try {
      localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    } catch (error) {
      console.error("Failed to write isDarkMode to localStorage:", error);
    }
  }, [isDarkMode]);
  useEffect(() => {
    const newMenu = [...menuItems];
    if (loader) {
      return <Preloader />;
    }
    if (profile) {
      setLogoLight(
        transformMediaUrl(profile?.logoLight, {width: 800, quality: 80, format: "auto"})
         || "/img/logo-light.png"
      );
      setLogoDark(
        transformMediaUrl(profile?.logoDark, {width: 800, quality: 80, format: "auto"}) ||
          "/img/logo-dark.png"
      );
      if (profile?.resume) {
        newMenu.push({
          label: "Resume",
          href: '/resume',
        });
      }
    }
    setDynamicMenu(newMenu);
  }, [profile, loader]);

  return (
     <>
      {/* 🔹 Glass effect CSS (inline at file level) */}
      <style>{`
        @keyframes headerGlowFlow {
          0% {
            background-position: 180% 50%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            background-position: -80% 50%;
            opacity: 0;
          }
        }

        .header {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          transition: background 0.3s ease, backdrop-filter 0.3s ease;
        }

        .header > * {
          position: relative;
          z-index: 1;
        }

        .header::before {
          content: "";
          position: absolute;
          inset: -1px;
          padding: 1.25px;
          border-radius: inherit;
          pointer-events: none;
          background:
            linear-gradient(
              105deg,
              transparent 0%,
              transparent 26%,
              rgba(0, 0, 0, 0.06) 32%,
              rgba(0, 0, 0, 0.14) 40%,
              rgba(0, 0, 0, 0.78) 47%,
              rgba(0, 0, 0, 0.92) 50%,
              rgba(0, 0, 0, 0.78) 53%,
              rgba(0, 0, 0, 0.14) 60%,
              rgba(0, 0, 0, 0.06) 68%,
              transparent 74%,
              transparent 100%
            );
          background-size: 220% 100%;
          animation: headerGlowFlow 4.8s linear infinite;
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 1;
        }

        .header::after {
          content: "";
          position: absolute;
          inset: -10px;
          border-radius: 18px;
          pointer-events: none;
          background:
            linear-gradient(
              105deg,
              transparent 0%,
              transparent 28%,
              rgba(0, 0, 0, 0.03) 36%,
              rgba(0, 0, 0, 0.07) 43%,
              rgba(0, 0, 0, 0.22) 48%,
              rgba(0, 0, 0, 0.16) 52%,
              rgba(0, 0, 0, 0.22) 56%,
              rgba(0, 0, 0, 0.07) 63%,
              rgba(0, 0, 0, 0.03) 70%,
              transparent 78%,
              transparent 100%
            );
          background-size: 220% 100%;
          animation: headerGlowFlow 4.8s linear infinite;
          filter: blur(14px);
          opacity: 0.75;
          z-index: 0;
          -webkit-mask:
            linear-gradient(#000 0 0) padding-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        body.odd .header {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        body.odd .header::before {
          background:
            linear-gradient(
              105deg,
              transparent 0%,
              transparent 24%,
              rgba(255, 255, 255, 0.1) 31%,
              rgba(255, 255, 255, 0.18) 39%,
              rgba(255, 255, 255, 0.92) 47%,
              rgba(255, 255, 255, 1) 50%,
              rgba(255, 255, 255, 0.92) 53%,
              rgba(255, 255, 255, 0.18) 61%,
              rgba(255, 255, 255, 0.1) 69%,
              transparent 76%,
              transparent 100%
            );
          background-size: 220% 100%;
        }

        body.odd .header::after {
          background:
            linear-gradient(
              105deg,
              transparent 0%,
              transparent 28%,
              rgba(255, 255, 255, 0.04) 36%,
              rgba(255, 255, 255, 0.08) 43%,
              rgba(255, 255, 255, 0.32) 48%,
              rgba(255, 255, 255, 0.22) 52%,
              rgba(255, 255, 255, 0.32) 56%,
              rgba(255, 255, 255, 0.08) 63%,
              rgba(255, 255, 255, 0.04) 70%,
              transparent 78%,
              transparent 100%
            );
          background-size: 220% 100%;
        }

        @media (prefers-reduced-motion: reduce) {
          .header::before,
          .header::after {
            animation: none;
          }
        }

@media (min-width: 992px) {
  #header .navbar {
    min-height: 88px; /* adjust as needed */
  }

  #header .container.header {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
  @media (max-width: 768px) {
  .offcanvas {
    padding-top: 1.5rem;
  }
}

      `}</style>
    <header id="header">
      <nav className="navbar navbar-expand">
        <div className="container header">
          {/* Navbar Brand */}
          <div className="magnetic">
            <a className="navbar-brand" href="/">
              <img
                src={!isDarkMode ? logoDark : logoLight}
                alt="Logo"
                className="logo-main"
              />
            </a>
          </div>
          <div className="ms-auto"></div>

          {/* Navbar Nav */}
          <ul className="navbar-nav items d-none d-md-block">
            {dynamicMenu.map((item, index) => (
              <li className="nav-item" key={index}>
                {item.external ? (
                  <a
                    href={item.href}
                    className="nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    download={item.download || false}
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    href={item.href}
                    className={`nav-link ${
                      location.pathname === item.href ? "active" : ""
                    }`}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <ul className="navbar-nav icons d-flex align-items-center">
            <li className="nav-item">
              <a
                href="/"
                className="nav-link"
                onClick={toggleDarkMode}
                aria-label={
                  isDarkMode ? "Change to light theme" : "Change to dark theme"
                }
              >
                <span className="icon material-symbols-outlined">
                  {isDarkMode ? "light_mode" : "dark_mode"}
                </span>
              </a>
            </li>
          </ul>

          {/* Navbar Toggler */}
          <div
            className="navbar-toggler scrolled"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
          >
            <div className="navbar-header">
              <div className="content">
                <div className="toggler-icon"></div>
                <span className="title">Menu</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div id="navbar-main" className="main"></div>
    </header>
    </>
  );
};

export default Header;
