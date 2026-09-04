import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import axiosClient from "../utils/axiosClient";

const UpdateProblem = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy",
      tags: "array",

      visibleTestCases: [
        {
          input: "",
          output: "",
          explanation: "",
        },
      ],

      hiddenTestCases: [
        {
          input: "",
          output: "",
          explanation: "",
        },
      ],

      startCode: [
        {
          language: "C++",
          initialCode: "",
        },
        {
          language: "Java",
          initialCode: "",
        },
        {
          language: "JavaScript",
          initialCode: "",
        },
      ],

      referenceSolution: [
        {
          language: "C++",
          completeCode: "",
        },
        {
          language: "Java",
          completeCode: "",
        },
        {
          language: "JavaScript",
          completeCode: "",
        },
      ],
    },
  });

  // ================= VISIBLE TEST CASES =================

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  // ================= HIDDEN TEST CASES =================

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  // ================= FETCH EXISTING PROBLEM =================

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );

        console.log("Fetched Problem:", data);

        reset({
          title: data.title || "",
          description: data.description || "",
          difficulty: data.difficulty || "easy",
          tags: data.tags || "array",

          visibleTestCases: (data.visibleTestCases || []).map((testCase) => ({
            input: testCase.input || "",
            output: testCase.output || "",
            explanation: testCase.explanation || "",
          })),

          hiddenTestCases: (data.hiddenTestCases || []).map((testCase) => ({
            input: testCase.input || "",
            output: testCase.output || "",
            explanation: testCase.explanation || "",
          })),

          startCode:
            data.startCode && data.startCode.length > 0
              ? data.startCode
              : [
                  {
                    language: "C++",
                    initialCode: "",
                  },
                  {
                    language: "Java",
                    initialCode: "",
                  },
                  {
                    language: "JavaScript",
                    initialCode: "",
                  },
                ],

          referenceSolution:
            data.referenceSolution &&
            data.referenceSolution.length > 0
              ? data.referenceSolution
              : [
                  {
                    language: "C++",
                    completeCode: "",
                  },
                  {
                    language: "Java",
                    completeCode: "",
                  },
                  {
                    language: "JavaScript",
                    completeCode: "",
                  },
                ],
        });
      } catch (error) {
        console.error("Error fetching problem:", error);

        alert(
          error.response?.data ||
            "Failed to load problem"
        );
      }
    };

    if (problemId) {
      fetchProblem();
    }
  }, [problemId, reset]);

  // ================= UPDATE PROBLEM =================

  const onSubmit = async (data) => {
    console.log("Updating problem...");
    console.log("Problem ID:", problemId);
    console.log("Data:", data);

    try {
      // Do NOT send problemCreator
      // Backend already has the existing creator

      const updateData = {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        tags: data.tags,

        visibleTestCases: data.visibleTestCases,

        hiddenTestCases: data.hiddenTestCases,

        startCode: data.startCode,

        referenceSolution: data.referenceSolution,
      };

      console.log("Data being sent:", updateData);

      await axiosClient.put(
        `/problem/update/${problemId}`,
        updateData
      );

      alert("Problem updated successfully!");

      navigate("/admin/update");
    } catch (error) {
      console.error("Update error:", error);

      console.error(
        "Server response:",
        error.response?.data
      );

      alert(
        error.response?.data ||
          "Failed to update problem"
      );
    }
  };

  return (
    <div className="container mx-auto p-6">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Update Problem
        </h1>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/update")
          }
          className="btn btn-outline"
        >
          Back
        </button>

      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >

        {/* ================= BASIC INFORMATION ================= */}

        <div className="card bg-base-100 shadow-lg p-6">

          <h2 className="text-xl font-semibold mb-4">
            Basic Information
          </h2>

          <div className="space-y-4">

            {/* TITLE */}

            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  Title
                </span>
              </label>

              <input
                {...register("title")}
                className="input input-bordered w-full"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  Description
                </span>
              </label>

              <textarea
                {...register("description")}
                rows={8}
                className="textarea textarea-bordered w-full"
              />

            </div>

            {/* DIFFICULTY */}

            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  Difficulty
                </span>
              </label>

              <select
                {...register("difficulty")}
                className="select select-bordered w-full"
              >
                <option value="easy">
                  Easy
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="hard">
                  Hard
                </option>
              </select>

            </div>

            {/* TAGS */}

            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  Tag
                </span>
              </label>

              <select
                {...register("tags")}
                className="select select-bordered w-full"
              >
                <option value="array">
                  Array
                </option>

                <option value="linkedList">
                  Linked List
                </option>

                <option value="graph">
                  Graph
                </option>

                <option value="dp">
                  DP
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* ================= VISIBLE TEST CASES ================= */}

        <div className="card bg-base-100 shadow-lg p-6">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-semibold">
              Visible Test Cases
            </h2>

            <button
              type="button"
              onClick={() =>
                appendVisible({
                  input: "",
                  output: "",
                  explanation: "",
                })
              }
              className="btn btn-sm btn-primary"
            >
              + Add Test Case
            </button>

          </div>

          <div className="space-y-4">

            {visibleFields.map((field, index) => (

              <div
                key={field.id}
                className="border rounded-lg p-4"
              >

                <div className="flex justify-between items-center mb-3">

                  <h3 className="font-semibold">
                    Test Case {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeVisible(index)
                    }
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>

                </div>

                <input
                  {...register(
                    `visibleTestCases.${index}.input`
                  )}
                  placeholder="Input"
                  className="input input-bordered w-full mb-2"
                />

                <input
                  {...register(
                    `visibleTestCases.${index}.output`
                  )}
                  placeholder="Expected Output"
                  className="input input-bordered w-full mb-2"
                />

                <textarea
                  {...register(
                    `visibleTestCases.${index}.explanation`
                  )}
                  placeholder="Explanation"
                  className="textarea textarea-bordered w-full"
                />

              </div>

            ))}

          </div>

        </div>

        {/* ================= HIDDEN TEST CASES ================= */}

        <div className="card bg-base-100 shadow-lg p-6">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-semibold">
              Hidden Test Cases
            </h2>

            <button
              type="button"
              onClick={() =>
                appendHidden({
                  input: "",
                  output: "",
                  explanation: "",
                })
              }
              className="btn btn-sm btn-primary"
            >
              + Add Test Case
            </button>

          </div>

          <div className="space-y-4">

            {hiddenFields.map((field, index) => (

              <div
                key={field.id}
                className="border rounded-lg p-4"
              >

                <div className="flex justify-between items-center mb-3">

                  <h3 className="font-semibold">
                    Hidden Test Case {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeHidden(index)
                    }
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>

                </div>

                {/* INPUT */}

                <input
                  {...register(
                    `hiddenTestCases.${index}.input`
                  )}
                  placeholder="Input"
                  className="input input-bordered w-full mb-2"
                />

                {/* OUTPUT */}

                <input
                  {...register(
                    `hiddenTestCases.${index}.output`
                  )}
                  placeholder="Expected Output"
                  className="input input-bordered w-full mb-2"
                />

                {/* EXPLANATION */}

                <textarea
                  {...register(
                    `hiddenTestCases.${index}.explanation`
                  )}
                  placeholder="Explanation"
                  className="textarea textarea-bordered w-full"
                />

              </div>

            ))}

          </div>

        </div>

        {/* ================= STARTING CODE ================= */}

        <div className="card bg-base-100 shadow-lg p-6">

          <h2 className="text-xl font-semibold mb-6">
            Starting Code
          </h2>

          <div className="space-y-6">

            {[0, 1, 2].map((index) => (

              <div key={index}>

                <h3 className="font-semibold mb-2">
                  {index === 0
                    ? "C++"
                    : index === 1
                    ? "Java"
                    : "JavaScript"}
                </h3>

                <textarea
                  {...register(
                    `startCode.${index}.initialCode`
                  )}
                  rows={10}
                  className="textarea textarea-bordered w-full font-mono"
                />

              </div>

            ))}

          </div>

        </div>

        {/* ================= REFERENCE SOLUTIONS ================= */}

        <div className="card bg-base-100 shadow-lg p-6">

          <h2 className="text-xl font-semibold mb-2">
            Reference Solutions
          </h2>

          <p className="text-sm opacity-70 mb-6">
            Reference solutions are tested against
            the visible test cases before updating.
          </p>

          <div className="space-y-6">

            {[0, 1, 2].map((index) => (

              <div key={index}>

                <h3 className="font-semibold mb-2">
                  {index === 0
                    ? "C++"
                    : index === 1
                    ? "Java"
                    : "JavaScript"}
                </h3>

                <textarea
                  {...register(
                    `referenceSolution.${index}.completeCode`
                  )}
                  rows={14}
                  className="textarea textarea-bordered w-full font-mono"
                />

              </div>

            ))}

          </div>

        </div>

        {/* ================= BUTTONS ================= */}

        <div className="flex gap-4">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/update")
            }
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary flex-1"
          >
            {isSubmitting
              ? "Updating..."
              : "Update Problem"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default UpdateProblem;