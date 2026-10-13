import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import UploadBox from "./components/UploadBox";
import ResultCard from "./components/ResultCard";
import History from "./components/History";
import Settings from "./components/Settings";
import Chatbot from "./components/Chatbot";
function App() {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const [activePage, setActivePage] = useState("Analyze");

  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") !== "light";
});
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [darkMode]);

  const analyzePrescription = async () => {
    if (!file) {
      setError("Please upload a prescription image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/analyze`,
        formData
      );

      console.log("Backend response:", response.data);

      setResults(response.data.investigations || []);
    } catch (err) {
      console.error("Analysis error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to analyze prescription."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setFile(null);
    setResults([]);
    setError("");
  };

  const renderAnalyze = () => {
    return (
      <div className="analyze-grid">

        {/* LEFT - PRESCRIPTION */}
        <section className="glass-card prescription-panel">

          <div className="section-label">
            PRESCRIPTION DOCUMENT
          </div>

          <h1 className="section-title">
            Ready for a new prescription
          </h1>

          <UploadBox
            onFileSelect={setFile}
          />

          {file && (
            <button
              onClick={analyzePrescription}
              disabled={loading}
              className="analyze-button"
            >
              {loading
                ? "Analyzing prescription..."
                : "Analyze Prescription"}
            </button>
          )}

          {error && (
            <div className="error-box">
              <strong>Error:</strong> {error}
            </div>
          )}

        </section>


        {/* RIGHT - RESULTS */}
        <section className="glass-card results-panel">

          <div className="section-label">
            AI EXTRACTION
          </div>

          <div className="results-heading">
            <div>
              <h2 className="section-title">
                Extracted investigations
              </h2>

              {results.length > 0 && (
                <p className="results-count">
                  {results.length} investigation
                  {results.length !== 1 ? "s" : ""} detected
                </p>
              )}
            </div>

            {results.length > 0 && (
              <button
                onClick={clearAnalysis}
                className="clear-button"
              >
                Clear
              </button>
            )}
          </div>


          {loading ? (
            <div className="empty-results">
              <div className="loading-spinner"></div>

              <h3>
                Analyzing prescription
              </h3>

              <p>
                AI is extracting medical investigations...
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="empty-results">

              <div className="empty-icon">
                ▧
              </div>

              <h3>
                No investigations extracted yet
              </h3>

              <p>
                Raw names, standardized names, and
                confidence scores will appear here.
              </p>

            </div>
          ) : (
            <div className="results-list">
              {results.map((investigation, index) => (
                <ResultCard
                  key={index}
                  investigation={investigation}
                />
              ))}
            </div>
          )}

        </section>

      </div>
    );
  };


  const renderPage = () => {
    switch (activePage) {

      case "History":
        return <History />;
      case "AI Agent":
        return <Chatbot investigations={results} />;

      case "Settings":
        return (
          <Settings
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );

      case "Analyze":
      default:
        return renderAnalyze();
    }
  };


  return (
    <div className="app-shell">

      {/* HEADER */}
      <header className="top-header">

        {/* BRAND */}
        <div className="brand">
  <img
    src="/agilens.jpg"
    alt="Agilens"
    className="agilens-logo"
  />
</div>


        {/* NAVIGATION */}
        <nav className="top-nav">

          <button
            className={
              activePage === "Analyze"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("Analyze")}
          >
            Analyze
          </button>

          <button
            className={
              activePage === "History"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("History")}
          >
            History
          </button>
          <button
  className={`nav-button ${activePage === "AI Agent" ? "active" : ""}`}
  onClick={() => setActivePage("AI Agent")}
>
 AI Agent
</button>

          <button
            className={
              activePage === "Settings"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("Settings")}
          >
            Settings
          </button>

        </nav>


        {/* THEME BUTTON */}
        <button
          className="theme-button"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
        >
          {darkMode ? "☀" : "☼"}
        </button>

      </header>


      {/* MAIN */}
      <main className="main-content">
        {renderPage()}
      </main>

    </div>
  );
}

export default App;