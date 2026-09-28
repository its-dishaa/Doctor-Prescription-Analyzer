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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <div className="mb-5">

        <h2 className="text-xl font-bold text-gray-800">
          Analyze Prescription
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Upload a prescription image to detect diagnostic investigations.
        </p>

      </div>


      {!preview ? (

        <label className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">

          <div className="text-5xl mb-4">
            📄
          </div>

          <h3 className="text-lg font-semibold text-gray-700">
            Upload prescription
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            PNG, JPG or JPEG
          </p>

          <div className="mt-5">

            <span className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
              Choose Image
            </span>

          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

        </label>

      ) : (

        <div>

          <div className="bg-gray-50 rounded-xl p-4">

            <img
              src={preview}
              alt="Prescription preview"
              className="max-h-96 mx-auto rounded-lg object-contain"
            />

          </div>

          <div className="flex justify-center mt-5">

            <button
              onClick={removeFile}
              className="px-5 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              Remove Image
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default UploadBox;