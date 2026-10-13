import React from "react";

function Settings({ darkMode, setDarkMode }) {

  return (
    <div className="page-container">

      <div className="page-heading">

        <div className="section-label">
          APPLICATION SETTINGS
        </div>

        <h1>
          Settings
        </h1>

        <p>
          Customize your Claris experience.
        </p>

      </div>


      <div className="settings-card">

        <div className="settings-section">

          <div>

            <h2>
              Appearance
            </h2>

            <p>
              Choose how Claris looks on your device.
            </p>

          </div>


          <button
            className={`theme-switch ${
              darkMode ? "on" : ""
            }`}
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >

            <span />

          </button>

        </div>


        <div className="theme-options">

          <button
            className={
              !darkMode
                ? "theme-option selected"
                : "theme-option"
            }
            onClick={() =>
              setDarkMode(false)
            }
          >

            <div className="theme-preview light-preview">
              ☼
            </div>

            <div>
              <strong>
                Light
              </strong>

              <p>
                Clean and bright
              </p>
            </div>

          </button>


          <button
            className={
              darkMode
                ? "theme-option selected"
                : "theme-option"
            }
            onClick={() =>
              setDarkMode(true)
            }
          >

            <div className="theme-preview dark-preview">
              ◐
            </div>

            <div>
              <strong>
                Dark
              </strong>

              <p>
                Comfortable for low light
              </p>
            </div>

          </button>

        </div>

      </div>


      <div className="settings-card">

        <div className="settings-section">

          <div>

            <h2>
              About Claris
            </h2>

            <p>
              AI-powered prescription investigation
              extraction.
            </p>

          </div>

          <span className="version-badge">
            v1.0
          </span>

        </div>


        <div className="about-grid">

          <div>
            <span>
              FRONTEND
            </span>

            <strong>
              React + Vite
            </strong>
          </div>

          <div>
            <span>
              AI
            </span>

            <strong>
              Gemini Vision
            </strong>
          </div>

          <div>
            <span>
              BACKEND
            </span>

            <strong>
              FastAPI
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;