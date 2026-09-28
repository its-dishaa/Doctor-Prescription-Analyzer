import React from "react";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Analyze", icon: "⌕" },
    { name: "History", icon: "◷" },
    { name: "Analytics", icon: "▥" },
    { name: "Settings", icon: "⚙" },
  ];

  return (
    <aside
      className="
        w-64
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-700
        min-h-screen
        fixed left-0 top-0
        transition-colors duration-300
      "
    >

      {/* Logo Section */}
      <div
        className="
          h-20
          flex items-center
          px-6
          border-b border-gray-200 dark:border-gray-700
        "
      >
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
          +
        </div>

        <div className="ml-3">
          <h1 className="font-bold text-gray-800 dark:text-white">
            Prescripto
          </h1>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            AI Analyzer
          </p>
        </div>
      </div>


      {/* Navigation */}
      <nav className="p-4">

        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-3 mb-3">
          Main Menu
        </p>

        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActivePage(item.name)}
            className={`
              w-full
              flex items-center
              px-4 py-3
              mb-2
              rounded-lg
              text-left
              transition-colors duration-200

              ${
                activePage === item.name
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }
            `}
          >

            <span className="text-xl w-8">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>

          </button>
        ))}

      </nav>


      {/* AI Powered Box */}
      <div className="absolute bottom-6 left-4 right-4">

        <div
          className="
            bg-blue-50 dark:bg-blue-900/20
            border border-transparent dark:border-blue-800
            rounded-xl
            p-4
          "
        >

          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
            AI Powered
          </p>

          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
            Prescription investigation extraction
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;