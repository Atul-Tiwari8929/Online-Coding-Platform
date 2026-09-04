import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

// Validation schema
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().min(1, "Description is required"),

  difficulty: z.enum(["easy", "medium", "hard"]),

  tags: z.enum(["array", "linkedList", "graph", "dp"]),

  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z
          .string()
          .min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case is required"),

  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z
          .string()
          .min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one hidden test case is required"),

  startCode: z
    .array(
      z.object({
        language: z.string(),
        initialCode: z
          .string()
          .min(1, "Initial code is required"),
      })
    )
    .length(3, "All three languages are required"),

  referenceSolution: z
    .array(
      z.object({
        language: z.string(),
        completeCode: z
          .string()
          .min(1, "Complete code is required"),
      })
    )
    .length(3, "All three languages are required"),
});

function AdminPanel() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(problemSchema),

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

  // Visible Test Cases
  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  // Hidden Test Cases
  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  // Create Problem
  const onSubmit = async (data) => {
    console.log("Create button clicked");
    console.log("Data:", data);

    try {
      await axiosClient.post(
        "/problem/create",
        data
      );

      alert("Problem created successfully!");

      navigate("/");
    } catch (error) {
      console.error(
        "Create Problem Error:",
        error
      );

      console.error(
        "Server Response:",
        error.response?.data
      );

      alert(
        error.response?.data ||
          "Failed to create problem"
      );
    }
  };

  // Validation error
  const onInvalid = (errors) => {
    console.error(
      "Form Validation Errors:",
      errors
    );

    alert(
      "Please fill all required fields correctly."
    );
  };

  return (
    <div className="container mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Create New Problem
      </h1>

      <form
        onSubmit={handleSubmit(
          onSubmit,
          onInvalid
        )}
        className="space-y-6"
      >

        {/* ================= BASIC INFORMATION ================= */}

        <div className="card bg-base-100 shadow-lg p-6">

          <h2 className="text-xl font-semibold mb-4">
            Basic Information
          </h2>

          <div className="space-y-4">

            {/* Title */}

            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  Title
                </span>
              </label>

              <input
                {...register("title")}
                placeholder="Enter problem title"
                className="input input-bordered w-full"
              />

              {errors.title && (
                <span className="text-error text-sm mt-1">
                  {errors.title.message}
                </span>
              )}

            </div>


            {/* Description */}

            <div className="form-control">

              <label className="label">
                <span className="label-text">
                  Description
                </span>
              </label>

              <textarea
                {...register("description")}
                placeholder="Enter problem description"
                rows={7}
                className="textarea textarea-bordered w-full"
              />

              {errors.description && (
                <span className="text-error text-sm mt-1">
                  {errors.description.message}
                </span>
              )}

            </div>


            {/* Difficulty */}

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


            {/* Tags */}

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
              + Add Visible Case
            </button>

          </div>


          <div className="space-y-4">

            {visibleFields.map(
              (field, index) => (

                <div
                  key={field.id}
                  className="border p-4 rounded-lg space-y-3"
                >

                  <div className="flex justify-between items-center">

                    <h4 className="font-medium">
                      Visible Test Case{" "}
                      {index + 1}
                    </h4>

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
                    className="input input-bordered w-full"
                  />

                  <input
                    {...register(
                      `visibleTestCases.${index}.output`
                    )}
                    placeholder="Expected Output"
                    className="input input-bordered w-full"
                  />

                  <textarea
                    {...register(
                      `visibleTestCases.${index}.explanation`
                    )}
                    placeholder="Explanation"
                    className="textarea textarea-bordered w-full"
                  />

                </div>

              )
            )}

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
              + Add Hidden Case
            </button>

          </div>


          <div className="space-y-4">

            {hiddenFields.map(
              (field, index) => (

                <div
                  key={field.id}
                  className="border p-4 rounded-lg space-y-3"
                >

                  <div className="flex justify-between items-center">

                    <h4 className="font-medium">
                      Hidden Test Case{" "}
                      {index + 1}
                    </h4>

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


                  <input
                    {...register(
                      `hiddenTestCases.${index}.input`
                    )}
                    placeholder="Input"
                    className="input input-bordered w-full"
                  />


                  <input
                    {...register(
                      `hiddenTestCases.${index}.output`
                    )}
                    placeholder="Expected Output"
                    className="input input-bordered w-full"
                  />


                  <textarea
                    {...register(
                      `hiddenTestCases.${index}.explanation`
                    )}
                    placeholder="Explanation"
                    className="textarea textarea-bordered w-full"
                  />

                </div>

              )
            )}

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
                  placeholder={`Enter ${index === 0
                    ? "C++"
                    : index === 1
                    ? "Java"
                    : "JavaScript"
                  } starting code`}
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
            These solutions are checked against
            the visible test cases before saving.
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
                  placeholder={`Enter ${index === 0
                    ? "C++"
                    : index === 1
                    ? "Java"
                    : "JavaScript"
                  } complete solution`}
                  rows={14}
                  className="textarea textarea-bordered w-full font-mono"
                />

              </div>

            ))}

          </div>

        </div>


        {/* ================= CREATE BUTTON ================= */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full"
        >
          {isSubmitting
            ? "Creating Problem..."
            : "Create Problem"}
        </button>

      </form>

    </div>
  );
}

export default AdminPanel;