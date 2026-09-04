import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Fetch submission history
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!problemId) {
        setError("Problem ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axiosClient.get(
          `/problem/submittedProblem/${problemId}`
        );

        // Make sure submissions is always an array
        setSubmissions(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (err) {
        console.error("Error fetching submission history:", err);

        setError(
          err.response?.data?.message ||
            "Failed to fetch submission history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  // Status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "badge-success";

      case "wrong":
      case "wrong answer":
        return "badge-error";

      case "error":
        return "badge-warning";

      case "pending":
        return "badge-info";

      default:
        return "badge-neutral";
    }
  };

  // Format memory
  const formatMemory = (memory) => {
    if (memory === undefined || memory === null) {
      return "N/A";
    }

    if (memory < 1024) {
      return `${memory} KB`;
    }

    return `${(memory / 1024).toFixed(2)} MB`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Submission History
      </h2>

      {/* No submissions */}
      {submissions.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>

            <span>No submissions found for this problem</span>
          </div>
        </div>
      ) : (
        <>
          {/* Submission Table */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Test Cases</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={sub._id || index}>
                    {/* Number */}
                    <td>{index + 1}</td>

                    {/* Language */}
                    <td className="font-mono">
                      {sub.language || "N/A"}
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`badge ${getStatusColor(
                          sub.status
                        )}`}
                      >
                        {sub.status
                          ? sub.status.charAt(0).toUpperCase() +
                            sub.status.slice(1)
                          : "Unknown"}
                      </span>
                    </td>

                    {/* Runtime */}
                    <td className="font-mono">
                      {sub.runtime ?? "N/A"} sec
                    </td>

                    {/* Memory */}
                    <td className="font-mono">
                      {formatMemory(sub.memory)}
                    </td>

                    {/* Test Cases */}
                    <td className="font-mono">
                      {sub.testCasesPassed ?? 0}/
                      {sub.testCasesTotal ?? 0}
                    </td>

                    {/* Date */}
                    <td>{formatDate(sub.createdAt)}</td>

                    {/* View */}
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() =>
                          setSelectedSubmission(sub)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submission Count */}
          <p className="mt-4 text-sm text-gray-500">
            Showing {submissions.length} submission
            {submissions.length !== 1 ? "s" : ""}
          </p>
        </>
      )}

      {/* =====================================================
          CODE VIEW MODAL
      ===================================================== */}

      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            {/* Modal Header */}
            <h3 className="font-bold text-lg mb-4">
              Submission Details:{" "}
              {selectedSubmission.language || "Unknown"}
            </h3>

            {/* Submission Information */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {/* Status */}
                <span
                  className={`badge ${getStatusColor(
                    selectedSubmission.status
                  )}`}
                >
                  {selectedSubmission.status || "Unknown"}
                </span>

                {/* Runtime */}
                <span className="badge badge-outline">
                  Runtime: {selectedSubmission.runtime ?? "N/A"}s
                </span>

                {/* Memory */}
                <span className="badge badge-outline">
                  Memory:{" "}
                  {formatMemory(selectedSubmission.memory)}
                </span>

                {/* Test Cases */}
                <span className="badge badge-outline">
                  Passed:{" "}
                  {selectedSubmission.testCasesPassed ?? 0}/
                  {selectedSubmission.testCasesTotal ?? 0}
                </span>
              </div>

              {/* Error Message */}
              {selectedSubmission.errorMessage && (
                <div className="alert alert-error mt-2">
                  <div>
                    <span>
                      {selectedSubmission.errorMessage}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submitted Code */}
            <div>
              <h4 className="font-semibold mb-2">
                Submitted Code
              </h4>

              <pre className="p-4 bg-gray-900 text-gray-100 rounded overflow-auto max-h-[500px]">
                <code>
                  {selectedSubmission.code || "No code available"}
                </code>
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;