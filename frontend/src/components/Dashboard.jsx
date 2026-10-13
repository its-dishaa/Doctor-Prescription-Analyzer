import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const [stats, setStats] = useState({
    total_prescriptions: 0,
    total_investigations: 0,
    validated_investigations: 0,
    unvalidated_investigations: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/v1/analytics`
      );

      setStats({
        total_prescriptions:
          response.data.total_prescriptions || 0,

        total_investigations:
          response.data.total_investigations || 0,

        validated_investigations:
          response.data.validated_investigations || 0,

        unvalidated_investigations:
          response.data.unvalidated_investigations || 0,
      });
    } catch (err) {
      console.error("Dashboard statistics error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const validationPercentage =
    stats.total_investigations > 0
      ? Math.round(
          (stats.validated_investigations /
            stats.total_investigations) *
            100
        )
      : 0;

  const unvalidatedPercentage =
    stats.total_investigations > 0
      ? Math.round(
          (stats.unvalidated_investigations /
            stats.total_investigations) *
            100
        )
      : 0;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-blue-600">
          AI PRESCRIPTION ANALYZER
        </p>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          Dashboard
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Overview of prescription analysis and investigation extraction.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Prescriptions */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Prescriptions
              </p>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
                {loading ? "..." : stats.total_prescriptions}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-2xl">
              📄
            </div>

          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-5">
            Prescriptions analyzed
          </p>

        </div>

        {/* Investigations */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Investigations
              </p>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
                {loading ? "..." : stats.total_investigations}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-2xl">
              🔬
            </div>

          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-5">
            Tests extracted
          </p>

        </div>

        {/* Validated */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Validated
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-3">
                {loading ? "..." : stats.validated_investigations}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950 flex items-center justify-center text-2xl">
              ✓
            </div>

          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-5">
            Matched with database
          </p>

        </div>

        {/* Unvalidated */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Unvalidated
              </p>

              <h2 className="text-3xl font-bold text-orange-500 mt-3">
                {loading ? "..." : stats.unvalidated_investigations}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950 flex items-center justify-center text-2xl">
              !
            </div>

          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-5">
            Require further validation
          </p>

        </div>

      </div>

      {/* Validation Summary */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">

        <div className="flex justify-between items-start mb-7">

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Validation Summary
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Investigation validation status.
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {validationPercentage}%
            </p>

            <p className="text-xs text-gray-400">
              validated
            </p>
          </div>

        </div>

        {stats.total_investigations > 0 ? (

          <div className="space-y-6">

            {/* Validated */}
            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Validated
                </span>

                <span className="text-sm font-semibold text-green-600">
                  {stats.validated_investigations} (
                  {validationPercentage}%)
                </span>

              </div>

              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${validationPercentage}%`,
                  }}
                />

              </div>

            </div>

            {/* Unvalidated */}
            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unvalidated
                </span>

                <span className="text-sm font-semibold text-orange-500">
                  {stats.unvalidated_investigations} (
                  {unvalidatedPercentage}%)
                </span>

              </div>

              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${unvalidatedPercentage}%`,
                  }}
                />

              </div>

            </div>

          </div>

        ) : (

          <div className="py-12 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">

            <div className="text-4xl mb-3">
              📊
            </div>

            <p className="font-medium text-gray-700 dark:text-gray-300">
              No prescription data yet
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Analyze a prescription to see dashboard statistics.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;