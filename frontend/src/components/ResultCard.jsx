import React from "react";

function ResultCard({ investigation }) {

  const confidence = investigation.confidence ?? 0;

  const confidencePercent =
    typeof confidence === "number"
      ? confidence <= 1
        ? Math.round(confidence * 100)
        : Math.round(confidence)
      : 0;


  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-xs uppercase tracking-wide text-gray-400">
            Investigation
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-1">
            {investigation.canonical_name || "Unknown"}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Raw: {investigation.raw_name || "N/A"}
          </p>

        </div>


        {/* Confidence */}

        <div className="text-right">

          <p className="text-xs text-gray-400">
            Confidence
          </p>

          <p className="text-lg font-bold text-blue-600">
            {confidencePercent}%
          </p>

        </div>

      </div>


      {/* Confidence bar */}

      <div className="mt-4">

        <div className="w-full bg-gray-100 rounded-full h-2">

          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{
              width: `${Math.min(confidencePercent, 100)}%`
            }}
          />

        </div>

      </div>


      {/* Information */}

      <div className="grid grid-cols-2 gap-4 mt-5">

        <div className="bg-gray-50 rounded-lg p-3">

          <p className="text-xs text-gray-400">
            Department
          </p>

          <p className="text-sm font-semibold text-gray-700 mt-1">
            {investigation.department || "N/A"}
          </p>

        </div>


        <div className="bg-gray-50 rounded-lg p-3">

          <p className="text-xs text-gray-400">
            Fasting
          </p>

          <p className="text-sm font-semibold text-gray-700 mt-1">
            {investigation.fasting || "N/A"}
          </p>

        </div>

      </div>


      {/* Validation */}

      <div className="mt-4">

        {investigation.validated ? (

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">
            ✓ Validated
          </span>

        ) : (

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-600">
            ⚠ Not validated
          </span>

        )}

      </div>

    </div>
  );
}

export default ResultCard;