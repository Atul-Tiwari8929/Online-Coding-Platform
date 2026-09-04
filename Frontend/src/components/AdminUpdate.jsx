// AdminUpdate.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";

const AdminUpdate = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axiosClient.get(
        "/problem/getAllProblems"
      );

      setProblems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching problems:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch problems"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/admin/update/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Update Problems
      </h1>

      {problems.length === 0 ? (
        <div className="alert alert-info">
          No problems found.
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="table table-zebra">

            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {problems.map((problem, index) => (
                <tr key={problem._id}>

                  <td>{index + 1}</td>

                  <td className="font-medium">
                    {problem.title}
                  </td>

                  <td>
                    <span className="badge badge-primary">
                      {problem.difficulty}
                    </span>
                  </td>

                  <td>
                    <span className="badge badge-outline">
                      {Array.isArray(problem.tags)
                        ? problem.tags.join(", ")
                        : problem.tags}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        handleUpdate(problem._id)
                      }
                      className="btn btn-sm btn-warning"
                    >
                      Update
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default AdminUpdate;