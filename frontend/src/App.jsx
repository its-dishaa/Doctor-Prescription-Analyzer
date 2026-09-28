import React, { useState, useEffect } from "react";
import axios from "axios";

import Dashboard from "./components/Dashboard";
import History from "./components/History";
import Sidebar from "./components/Sidebar";
import UploadBox from "./components/UploadBox";
import ResultCard from "./components/ResultCard";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";

function App() {

  // -------------------------
  // Theme
  // -------------------------

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);


  // -------------------------
  // Navigation
  // -------------------------

  const [activePage, setActivePage] = useState("Dashboard");


  // -------------------------
  // Prescription Analysis
  // -------------------------

  const [file, setFile] = useState(null);

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // -------------------------
  // Analyze Prescription
  // -------------------------

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
        "http://127.0.0.1:8000/api/v1/analyze",
        formData
      );

      console.log("Backend response:", response.data);

      setResults(
        response.data.investigations || []
      );

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


  // -------------------------
  // Clear Analysis
  // -------------------------

  const clearAnalysis = () => {

    setFile(null);

    setResults([]);

    setError("");

  };


  // -------------------------
  // Analyze Page
  // -------------------------

  const renderAnalyze = () => {

    return (
      <div>

        {/* Header */}

        <div className="mb-8">

          <p className="text-sm text-blue-600 font-semibold">
            PRESCRIPTION ANALYSIS
          </p>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
            Analyze Prescription
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Upload a prescription image and extract diagnostic investigations.
          </p>

        </div>


        {/* Upload */}

        <UploadBox
          onFileSelect={setFile}
        />


        {/* Analyze Button */}

        {file && (

          <div className="flex justify-center mt-6">

            <button
              onClick={analyzePrescription}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold shadow-sm transition"
            >

              {loading
                ? "Analyzing Prescription..."
                : "Analyze Prescription"
              }

            </button>

          </div>

        )}


        {/* Error */}

        {error && (

          <div className="mt-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4">

            <strong>Error:</strong> {error}

          </div>

        )}


        {/* Results */}

        {results.length > 0 && (

          <section className="mt-10">

            <div className="flex justify-between items-center mb-5">

              <div>

                <p className="text-sm text-blue-600 font-semibold">
                  ANALYSIS RESULT
                </p>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  Detected Investigations
                </h2>

              </div>


              <button
                onClick={clearAnalysis}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
              >
                Clear
              </button>

            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {results.map((investigation, index) => (

                <ResultCard
                  key={index}
                  investigation={investigation}
                />

              ))}

            </div>

          </section>

        )}

      </div>
    );
  };


  // -------------------------
  // Render Application
  // -------------------------

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">

      {/* Sidebar */}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />


      {/* Main Content */}

      <main className="ml-64 min-h-screen">

        {/* Top Bar */}

        <div className="h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 transition-colors">

          <div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Doctor Prescription Analyzer
            </p>

          </div>


          <div className="flex items-center gap-3">

            <div className="w-9 h-9 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center text-blue-600 font-bold">
              AI
            </div>

            <div>

              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                AI System
              </p>

              <p className="text-xs text-green-500">
                ● Online
              </p>

            </div>

          </div>

        </div>


        {/* Page Content */}

        <div className="p-8 max-w-7xl mx-auto">

          {/* Dashboard */}

          {activePage === "Dashboard" && (
            <Dashboard />
          )}


          {/* Analyze */}

          {activePage === "Analyze" && (
            renderAnalyze()
          )}


          {/* History */}

          {activePage === "History" && (
            <History />
          )}


          {/* Analytics */}

          {activePage === "Analytics" && (
            <Analytics />
          )}


          {/* Settings */}

          {activePage === "Settings" && (

            <Settings
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />

          )}

        </div>

      </main>

    </div>

  );
}

export default App;