import React, { useState } from "react";

function UploadBox({ onFileSelect }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setPreview(URL.createObjectURL(selectedFile));
    onFileSelect(selectedFile);
  };

  const removeFile = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="upload-container">

      {!preview ? (

        <label className="upload-zone">

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            hidden
          />

          <div className="upload-icon">
            ✧
          </div>

          <h3>
            Extract medical investigations from
            handwritten prescriptions using AI.
          </h3>

          <p>
            Drop a prescription here or browse your device
          </p>

          <span className="file-types">
            JPG · JPEG · PNG
          </span>

        </label>

      ) : (

        <div className="preview-container">

          <img
            src={preview}
            alt="Prescription preview"
            className="prescription-preview"
          />

          <div className="preview-actions">

            <span className="selected-file">
              {fileName(preview)}
            </span>

            <button
              onClick={removeFile}
              className="remove-button"
            >
              Remove
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

function fileName(path) {
  return path?.split("/").pop() || "Prescription selected";
}

export default UploadBox;