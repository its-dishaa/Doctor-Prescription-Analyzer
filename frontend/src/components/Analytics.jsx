import React, { useEffect, useState } from "react";
import axios from "axios";


function Analytics() {

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    fetchAnalytics();

  }, []);


  const fetchAnalytics = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/analytics"
      );

      console.log(
        "Analytics:",
        response.data
      );

      setAnalytics(response.data);

    } catch (err) {

      console.error(err);

      setError(
        "Unable to load analytics."
      );

    } finally {

      setLoading(false);

    }
  };


  // -------------------------
  // Loading
  // -------------------------

  if (loading) {

    return (
      <div className="text-center py-20">

        <p className="text-gray-500">
          Loading analytics...
        </p>

      </div>
    );

  }


  // -------------------------
  // Error
  // -------------------------

  if (error) {

    return (
      <div className="bg-red-50 text-red-600 p-5 rounded-xl">
        {error}
      </div>
    );

  }


  if (!analytics) {
    return null;
  }


  // -------------------------
  // Calculate validation %
  // -------------------------

  const validationRate =
    analytics.total_investigations > 0
      ? Math.round(
          (
            analytics.validated_investigations /
            analytics.total_investigations
          ) * 100
        )
      : 0;


  return (

    <div>

      {/* Header */}

      <div className="mb-8">

        <p className="text-sm text-blue-600 font-semibold">
          PERFORMANCE OVERVIEW
        </p>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
          Analytics
        </h1>

        <p className="text-gray-500  dark:text-white mt-2 ">
          Overview of prescription analysis and investigation detection.
        </p>

      </div>


      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">


        {/* Total prescriptions */}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Prescriptions
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {analytics.total_prescriptions}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Analyzed prescriptions
          </p>

        </div>


        {/* Total investigations */}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Investigations
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {analytics.total_investigations}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Tests detected
          </p>

        </div>


        {/* Validated */}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Validated
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {analytics.validated_investigations}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Successfully validated
          </p>

        </div>


        {/* Confidence */}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Avg Confidence
          </p>

          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {analytics.average_confidence}%
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            Across detected tests
          </p>

        </div>

      </div>


      {/* Second row */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">


        {/* Validation */}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-800">
            Validation Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Investigation validation status
          </p>


          {/* Progress */}

          <div className="mt-6">

            <div className="flex justify-between text-sm mb-2">

              <span className="text-gray-600">
                Validation rate
              </span>

              <span className="font-semibold text-green-600">
                {validationRate}%
              </span>

            </div>


            <div className="w-full bg-gray-100 rounded-full h-4">

              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{
                  width: `${validationRate}%`
                }}
              />

            </div>

          </div>


          {/* Numbers */}

          <div className="grid grid-cols-2 gap-4 mt-6">


            <div className="bg-green-50 rounded-lg p-4">

              <p className="text-xs text-gray-500">
                Validated
              </p>

              <p className="text-2xl font-bold text-green-600 mt-1">
                {analytics.validated_investigations}
              </p>

            </div>


            <div className="bg-yellow-50 rounded-lg p-4">

              <p className="text-xs text-gray-500">
                Not Validated
              </p>

              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {analytics.unvalidated_investigations}
              </p>

            </div>

          </div>

        </div>


        {/* Most detected */}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-800">
            Most Detected Investigations
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Most frequently extracted tests
          </p>


          <div className="mt-6 space-y-4">

            {analytics.most_detected.length === 0 ? (

              <p className="text-gray-500">
                No investigation data available.
              </p>

            ) : (

              analytics.most_detected.map(
                (item, index) => {

                  const maxCount =
                    analytics.most_detected[0].count;

                  const percentage =
                    (item.count / maxCount) * 100;


                  return (

                    <div key={index}>

                      <div className="flex justify-between mb-1">

                        <span className="text-sm font-medium text-gray-700">
                          {item.name}
                        </span>

                        <span className="text-sm font-semibold text-blue-600">
                          {item.count}
                        </span>

                      </div>


                      <div className="w-full bg-gray-100 rounded-full h-2">

                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${percentage}%`
                          }}
                        />

                      </div>

                    </div>

                  );

                }

              )

            )}

          </div>

        </div>

      </div>


      {/* Summary */}

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        <h2 className="text-xl font-bold text-gray-800">
          Analysis Summary
        </h2>

        <p className="text-gray-500 mt-2">

          The system has analyzed{" "}

          <strong className="text-gray-800">
            {analytics.total_prescriptions}
          </strong>{" "}

          prescriptions and detected{" "}

          <strong className="text-gray-800">
            {analytics.total_investigations}
          </strong>{" "}

          diagnostic investigations.

          {" "}

          <strong className="text-green-600">
            {validationRate}%
          </strong>{" "}

          of detected investigations were successfully validated.

        </p>

      </div>

    </div>

  );
}

export default Analytics;