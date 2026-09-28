import React, { useEffect, useState } from "react";
import axios from "axios";

function History() {

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    fetchHistory();

  }, []);


  const fetchHistory = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/v1/prescriptions"
      );

      setPrescriptions(response.data);

    } catch (err) {

      console.error(err);

      setError(
        "Unable to load prescription history."
      );

    } finally {

      setLoading(false);

    }
  };


  if (loading) {

    return (
      <div className="text-center py-20">
        <p className="text-gray-500">
          Loading history...
        </p>
      </div>
    );

  }


  if (error) {

    return (
      <div className="bg-red-50 text-red-600 p-5 rounded-xl">
        {error}
      </div>
    );

  }


  return (

    <div>

      <div className="mb-8">

        <p className="text-sm text-blue-600 font-semibold">
          PRESCRIPTION RECORDS
        </p>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
          History
        </h1>

        <p className="text-gray-500 mt-2 dark:text-white ">
          View previously analyzed prescriptions.
        </p>

      </div>


      {prescriptions.length === 0 ? (

        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">

          <div className="text-5xl mb-4">
            📋
          </div>

          <h2 className="text-xl font-semibold text-gray-700">
            No prescriptions yet
          </h2>

          <p className="text-gray-500 mt-2">
            Your analyzed prescriptions will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {prescriptions.map((prescription) => {

            const result = prescription.result || {};

            const investigations =
              result.investigations || [];


            return (

              <div
                key={prescription.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-xs text-gray-400">
                      PRESCRIPTION
                    </p>

                    <h2 className="text-lg font-bold text-gray-800">
                      Prescription #{prescription.id}
                    </h2>

                  </div>


                  <div className="text-right">

                    <p className="text-sm font-semibold text-blue-600">
                      {investigations.length} investigations
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {prescription.created_at
                        ? new Date(
                            prescription.created_at
                          ).toLocaleString()
                        : "Unknown date"
                      }
                    </p>

                  </div>

                </div>


                <div className="mt-4 border-t pt-4">

                  {investigations.length > 0 ? (

                    <div className="flex flex-wrap gap-2">

                      {investigations.map(
                        (item, index) => (

                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                          >
                            {item.canonical_name ||
                             item.raw_name ||
                             "Unknown"}
                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-gray-500 text-sm">
                      No investigations detected.
                    </p>

                  )}

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>

  );
}

export default History;