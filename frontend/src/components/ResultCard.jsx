import React from "react";

function ResultCard({ investigation }) {

  const confidence = investigation.confidence ?? 0;

  const confidencePercent =
    typeof confidence === "number"
      ? confidence <= 1
        ? Math.round(confidence * 100)
        : Math.round(confidence)
      : 0;

  const rawName =
    investigation.raw_name ||
    "Unknown";

  const canonicalName =
    investigation.standard_name ||
    investigation.canonical_name ||
    "Not standardized";


  return (
    <div className="result-card">

      <div className="result-top">

        <div className="result-number">
          {String(confidencePercent).padStart(2, "0")}
        </div>

        <div className="result-main">

          <div className="result-label">
            INVESTIGATION
          </div>

          <h3>
            {canonicalName}
          </h3>

        </div>

        <div className="confidence">

          <span>
            CONFIDENCE
          </span>

          <strong>
            {confidencePercent}%
          </strong>

        </div>

      </div>


      <div className="result-details">

        <div className="detail-item">

          <span>
            RAW NAME
          </span>

          <p>
            {rawName}
          </p>

        </div>


        <div className="detail-item">

          <span>
            CANONICAL NAME
          </span>

          <p>
            {canonicalName}
          </p>

        </div>

      </div>


      <div className="confidence-bar">

        <div
          style={{
            width: `${Math.min(
              confidencePercent,
              100
            )}%`,
          }}
        />

      </div>

    </div>
  );
}

export default ResultCard;