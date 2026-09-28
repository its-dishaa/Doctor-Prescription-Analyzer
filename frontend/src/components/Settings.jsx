import React from "react";

function Settings({ darkMode, setDarkMode }) {
  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-blue-600 font-semibold">
          APPLICATION CONFIGURATION
        </p>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
          Settings
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Configure your Prescripto application.
        </p>
      </div>


      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Appearance
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose between light and dark theme.
        </p>


        {/* Theme Toggle */}
        <div className="flex items-center justify-between mt-8">

          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Dark Mode
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Turn dark mode on or off.
            </p>
          </div>


          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-14 h-7 rounded-full transition ${
              darkMode
                ? "bg-blue-600"
                : "bg-gray-300"
            }`}
          >

            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                darkMode
                  ? "left-8"
                  : "left-1"
              }`}
            />

          </button>

        </div>


        {/* Theme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

          {/* Light */}
          <button
            onClick={() => setDarkMode(false)}
            className={`p-6 rounded-xl border-2 text-left transition ${
              !darkMode
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 dark:border-gray-600"
            }`}
          >

            <div className="text-3xl">
              ☀️
            </div>

            <h3 className="font-bold text-gray-800 dark:text-white mt-3">
              Light
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Use the light appearance.
            </p>

          </button>


          {/* Dark */}
          <button
            onClick={() => setDarkMode(true)}
            className={`p-6 rounded-xl border-2 text-left transition ${
              darkMode
                ? "border-blue-500 bg-gray-700"
                : "border-gray-200 dark:border-gray-600"
            }`}
          >

            <div className="text-3xl">
              🌙
            </div>

            <h3 className="font-bold text-gray-800 dark:text-white mt-3">
              Dark
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Use the dark appearance.
            </p>

          </button>

        </div>

      </div>


      {/* System Information */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm mt-6">

        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          System Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              APPLICATION
            </p>

            <p className="font-semibold text-gray-800 dark:text-white mt-1">
              Prescripto AI Analyzer
            </p>
          </div>


          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              VERSION
            </p>

            <p className="font-semibold text-gray-800 dark:text-white mt-1">
              1.0.0
            </p>
          </div>


          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              BACKEND
            </p>

            <p className="font-semibold text-green-600 mt-1">
              FastAPI
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;