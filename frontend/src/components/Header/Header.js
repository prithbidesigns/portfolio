import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { menuItems } from "./menuConfig";
import { useProfile } from "../../context/profileContext";
import Preloader from "../Miscellaneous/Preloader";
import { transformImageKitUrl } from "../../utils/ImageKitUrlModify"; // Import the utility function

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
        transformImageKitUrl(profile?.logoLight, {width: 800, quality: 80, format: "auto"})
         || "/img/logo-light.png"
      );
      setLogoDark(
        transformImageKitUrl(profile?.logoDark, {width: 800, quality: 80, format: "auto"}) ||
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
        .header {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          transition: background 0.3s ease, backdrop-filter 0.3s ease;
        }

        body.odd .header {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
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
