import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
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
        "http://127.0.0.1:8000/api/v1/analytics"
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-blue-600 font-semibold">
          AI PRESCRIPTION ANALYZER
        </p>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
          Dashboard
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Overview of prescription analysis and investigation extraction.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        {/* Total Prescriptions */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Prescriptions
          </p>

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {loading ? "..." : stats.total_prescriptions}
          </h2>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            From database
          </p>
        </div>

        {/* Total Investigations */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Investigations
          </p>

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
            {loading ? "..." : stats.total_investigations}
          </h2>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Extracted from prescriptions
          </p>
        </div>

        {/* Validated */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Validated Investigations
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {loading ? "..." : stats.validated_investigations}
          </h2>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Matched with database
          </p>
        </div>

        {/* Unvalidated */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Unvalidated
          </p>

          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            {loading ? "..." : stats.unvalidated_investigations}
          </h2>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Require further validation
          </p>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Validation Summary
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Overview of investigation validation status.
            </p>
          </div>
        </div>

        {stats.total_investigations > 0 ? (
          <div className="space-y-5">

            {/* Validated */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Validated
                </span>

                <span className="text-sm font-semibold text-green-600">
                  {stats.validated_investigations}
                </span>
              </div>

              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{
                    width: `${
                      (stats.validated_investigations /
                        stats.total_investigations) *
                      100
                    }%`,
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
                  {stats.unvalidated_investigations}
                </span>
              </div>

              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all"
                  style={{
                    width: `${
                      (stats.unvalidated_investigations /
                        stats.total_investigations) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No prescription data available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;