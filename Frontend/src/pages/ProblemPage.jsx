import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAI from "../components/ChatAI";

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  const [loadingProblem, setLoadingProblem] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");

  const editorRef = useRef(null);

  const { problemId } = useParams();

  // =========================================================
  // GET STARTING CODE
  // =========================================================

  const getInitialCode = (problemData, language) => {
    if (!problemData?.startCode) {
      return "";
    }

    const languageMap = {
      javascript: ["javascript", "Javascript", "JavaScript"],
      java: ["java", "Java"],
      cpp: ["cpp", "C++", "c++"],
    };

    const possibleLanguages = languageMap[language] || [];

    const starterCode = problemData.startCode.find((item) => {
      if (!item?.language) return false;

      return possibleLanguages.some(
        (lang) => item.language.toLowerCase() === lang.toLowerCase()
      );
    });

    return starterCode?.initialCode || "";
  };

  // =========================================================
  // FETCH PROBLEM
  // =========================================================

  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) {
        console.error("Problem ID is missing");
        return;
      }

      try {
        setLoadingProblem(true);

        const { data } = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );

        setProblem(data);

        // Set starting code
        const initialCode = getInitialCode(data, selectedLanguage);

        setCode(initialCode);
      } catch (error) {
        console.error(
          "Error fetching problem:",
          error.response?.data || error.message
        );
      } finally {
        setLoadingProblem(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // =========================================================
  // CHANGE STARTING CODE WHEN LANGUAGE CHANGES
  // =========================================================

  useEffect(() => {
    if (!problem) return;

    const initialCode = getInitialCode(problem, selectedLanguage);

    setCode(initialCode);

    // Clear previous results when language changes
    setRunResult(null);
    setSubmitResult(null);

    setActiveRightTab("code");
  }, [selectedLanguage, problem]);

  // =========================================================
  // EDITOR
  // =========================================================

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    if (running || submitting) return;

    setSelectedLanguage(language);
  };

  // =========================================================
  // RUN CODE
  // =========================================================

  const handleRun = async () => {
    if (!problemId) {
      console.error("Problem ID is missing");
      return;
    }

    if (!code.trim()) {
      console.error("Code is empty");
      return;
    }

    try {
      setRunning(true);
      setRunResult(null);

      const response = await axiosClient.post(
        `/submission/run/${problemId}`,
        {
          code,
          language: selectedLanguage,
        }
      );

      console.log("RUN RESPONSE:", response.data);

      setRunResult(response.data);

      // Automatically open testcase tab
      setActiveRightTab("testcase");
    } catch (error) {
      console.error(
        "Error running code:",
        error.response?.data || error.message
      );

      setRunResult({
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data ||
          error.message,
        testCases: [],
        runtime: 0,
        memory: 0,
      });

      setActiveRightTab("testcase");
    } finally {
      setRunning(false);
    }
  };

  // =========================================================
  // SUBMIT CODE
  // =========================================================

  const handleSubmitCode = async () => {
    if (!problemId) {
      console.error("Problem ID is missing");
      return;
    }

    if (!code.trim()) {
      console.error("Code is empty");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitResult(null);

      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code,
          language: selectedLanguage,
        }
      );

      console.log("SUBMIT RESPONSE:", response.data);

      setSubmitResult(response.data);

      // Automatically open result tab
      setActiveRightTab("result");
    } catch (error) {
      console.error(
        "Error submitting code:",
        error.response?.data || error.message
      );

      setSubmitResult({
        accepted: false,
        error:
          error.response?.data?.message ||
          error.response?.data ||
          error.message,
        passedTestCases: 0,
        totalTestCases: 0,
        runtime: 0,
        memory: 0,
      });

      setActiveRightTab("result");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // MONACO LANGUAGE
  // =========================================================

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";

      case "java":
        return "java";

      case "cpp":
        return "cpp";

      default:
        return "javascript";
    }
  };

  // =========================================================
  // DIFFICULTY COLOR
  // =========================================================

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-500";

      case "medium":
        return "text-yellow-500";

      case "hard":
        return "text-red-500";

      default:
        return "text-gray-500";
    }
  };

  // =========================================================
  // RUN SUCCESS
  // =========================================================

  const isRunSuccessful = (result) => {
    return (
      result?.success === true ||
      result?.success === "true" ||
      result?.success === "accepted" ||
      result?.success === "success"
    );
  };

  // =========================================================
  // GET TESTCASE VALUE
  // =========================================================

  const getTestCaseValue = (
    testCase,
    keys,
    defaultValue = "N/A"
  ) => {
    if (!testCase) {
      return defaultValue;
    }

    for (const key of keys) {
      if (
        testCase[key] !== undefined &&
        testCase[key] !== null
      ) {
        return testCase[key];
      }
    }

    return defaultValue;
  };

  // =========================================================
  // FORMAT VALUE
  // =========================================================

  const formatValue = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "N/A";
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  // =========================================================
  // CHECK TESTCASE
  // =========================================================

  const isTestCasePassed = (testCase) => {
    if (typeof testCase?.passed === "boolean") {
      return testCase.passed;
    }

    if (typeof testCase?.success === "boolean") {
      return testCase.success;
    }

    let statusDescription = "";

    if (
      testCase?.status &&
      typeof testCase.status === "object"
    ) {
      statusDescription =
        testCase.status.description || "";
    } else {
      statusDescription = testCase?.status || "";
    }

    return (
      statusDescription.toLowerCase() === "accepted" ||
      statusDescription.toLowerCase() === "passed" ||
      statusDescription.toLowerCase() === "success"
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loadingProblem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="h-screen flex bg-base-100">

      {/* =====================================================
          LEFT PANEL
      ===================================================== */}

      <div className="w-1/2 flex flex-col border-r border-base-300">

        {/* LEFT TABS */}

        <div className="tabs tabs-bordered bg-base-200 px-4">

          <button
            className={`tab ${
              activeLeftTab === "description"
                ? "tab-active"
                : ""
            }`}
            onClick={() =>
              setActiveLeftTab("description")
            }
          >
            Description
          </button>

          <button
            className={`tab ${
              activeLeftTab === "editorial"
                ? "tab-active"
                : ""
            }`}
            onClick={() =>
              setActiveLeftTab("editorial")
            }
          >
            Editorial
          </button>

          <button
            className={`tab ${
              activeLeftTab === "solutions"
                ? "tab-active"
                : ""
            }`}
            onClick={() =>
              setActiveLeftTab("solutions")
            }
          >
            Solutions
          </button>

          <button
            className={`tab ${
              activeLeftTab === "submissions"
                ? "tab-active"
                : ""
            }`}
            onClick={() =>
              setActiveLeftTab("submissions")
            }
          >
            Submissions
          </button>

          <button
            className={`tab ${
              activeLeftTab === "chatAI"
                ? "tab-active"
                : ""
            }`}
            onClick={() =>
              setActiveLeftTab("chatAI")
            }
          >
            ChatAI
          </button>

        </div>

        {/* LEFT CONTENT */}

        <div className="flex-1 overflow-y-auto p-6">

          {problem && (
            <>

              {/* DESCRIPTION */}

              {activeLeftTab === "description" && (
                <div>

                  <div className="flex items-center gap-4 mb-6">

                    <h1 className="text-2xl font-bold">
                      {problem.title}
                    </h1>

                    <div
                      className={`badge ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty
                        ?.charAt(0)
                        .toUpperCase() +
                        problem.difficulty?.slice(1)}
                    </div>

                    <div className="badge badge-primary">
                      {Array.isArray(problem.tags)
                        ? problem.tags.join(", ")
                        : problem.tags}
                    </div>

                  </div>

                  <div className="prose max-w-none">

                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {problem.description}
                    </div>

                  </div>

                  {/* EXAMPLES */}

                  <div className="mt-8">

                    <h3 className="text-lg font-semibold mb-4">
                      Examples:
                    </h3>

                    <div className="space-y-4">

                      {problem.visibleTestCases?.map(
                        (example, index) => (
                          <div
                            key={index}
                            className="bg-base-200 p-4 rounded-lg"
                          >

                            <h4 className="font-semibold mb-2">
                              Example {index + 1}
                            </h4>

                            <div className="space-y-2 text-sm font-mono">

                              <div>
                                <strong>
                                  Input:
                                </strong>{" "}
                                {example.input}
                              </div>

                              <div>
                                <strong>
                                  Output:
                                </strong>{" "}
                                {example.output}
                              </div>

                              <div>
                                <strong>
                                  Explanation:
                                </strong>{" "}
                                {example.explanation}
                              </div>

                            </div>

                          </div>
                        )
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* EDITORIAL */}

              {activeLeftTab === "editorial" && (
                <div className="prose max-w-none">

                  <h2 className="text-xl font-bold mb-4">
                    Editorial
                  </h2>

                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    Editorial is here for the problem
                  </div>

                </div>
              )}

              {/* SOLUTIONS */}

              {activeLeftTab === "solutions" && (
                <div>

                  <h2 className="text-xl font-bold mb-4">
                    Solutions
                  </h2>

                  <div className="space-y-6">

                    {problem.referenceSolution?.map(
                      (solution, index) => (
                        <div
                          key={index}
                          className="border border-base-300 rounded-lg"
                        >

                          <div className="bg-base-200 px-4 py-2 rounded-t-lg">

                            <h3 className="font-semibold">
                              {problem.title} -{" "}
                              {solution?.language}
                            </h3>

                          </div>

                          <div className="p-4">

                            <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                              <code>
                                {solution.completeCode}
                              </code>
                            </pre>

                          </div>

                        </div>
                      )
                    )}

                    {!problem.referenceSolution?.length && (
                      <p className="text-gray-500">
                        Solutions will be available after
                        you solve the problem.
                      </p>
                    )}

                  </div>

                </div>
              )}

              {/* SUBMISSIONS */}

              {activeLeftTab === "submissions" && (
                <div>
                  <SubmissionHistory
                    problemId={problemId}
                  />
                </div>
              )}

             {/* ChatAI */}

              {activeLeftTab === "chatAI" && (
                <div className="prose max-w-none">

                  <h2 className="text-xl font-bold mb-4">
                    Chat with AI
                  </h2>

                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    <ChatAI problem={problem}></ChatAI>
                  </div>

                </div>
              )}

            </>
          )}

        </div>

      </div>

      {/* =====================================================
          RIGHT PANEL
      ===================================================== */}

      <div className="w-1/2 flex flex-col">

        {/* RIGHT TABS */}

        <div className="tabs tabs-bordered bg-base-200 px-4">

          <button
            className={`tab ${
              activeRightTab === "code"
                ? "tab-active"
                : ""
            }`}
            onClick={() =>
              setActiveRightTab("code")
            }
          >
            Code
          </button>

          <button
            className={`tab ${
              activeRightTab === "testcase"
                ? "tab-active"
                : ""
            }`}
            onClick={() =>
              setActiveRightTab("testcase")
            }
          >
            Testcase
          </button>

          <button
            className={`tab ${
              activeRightTab === "result"
                ? "tab-active"
                : ""
            }`}
            onClick={() =>
              setActiveRightTab("result")
            }
          >
            Result
          </button>

        </div>

        {/* RIGHT CONTENT */}

        <div className="flex-1 flex flex-col">

          {/* =================================================
              CODE TAB
          ================================================= */}

          {activeRightTab === "code" && (
            <div className="flex-1 flex flex-col">

              {/* LANGUAGE SELECTOR */}

              <div className="flex justify-between items-center p-4 border-b border-base-300">

                <div className="flex gap-2">

                  {["javascript", "java", "cpp"].map(
                    (lang) => (
                      <button
                        key={lang}
                        className={`btn btn-sm ${
                          selectedLanguage === lang
                            ? "btn-primary"
                            : "btn-ghost"
                        }`}
                        onClick={() =>
                          handleLanguageChange(lang)
                        }
                        disabled={
                          running || submitting
                        }
                      >
                        {lang === "cpp"
                          ? "C++"
                          : lang === "javascript"
                          ? "JavaScript"
                          : "Java"}
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* MONACO EDITOR */}

              <div className="flex-1">

                <Editor
                  height="100%"
                  language={getLanguageForMonaco(
                    selectedLanguage
                  )}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: {
                      enabled: false,
                    },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: "on",
                    lineNumbers: "on",
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: "line",
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: running || submitting,
                    cursorStyle: "line",
                    mouseWheelZoom: true,
                  }}
                />

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 p-4 border-t border-base-300">

                <button
                  type="button"
                  onClick={handleRun}
                  className="btn btn-outline"
                  disabled={
                    running || submitting
                  }
                >
                  {running ? "Running..." : "Run"}
                </button>

                <button
                  type="button"
                  onClick={handleSubmitCode}
                  className="btn btn-primary"
                  disabled={
                    running || submitting
                  }
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit"}
                </button>

              </div>

            </div>
          )}

          {/* =================================================
              TESTCASE TAB
          ================================================= */}

          {activeRightTab === "testcase" && (
            <div className="flex-1 p-4 overflow-y-auto">

              <h3 className="text-lg font-semibold mb-4">
                Test Results
              </h3>

              {!runResult ? (
                <p className="text-gray-500">
                  Click "Run" to execute your code.
                </p>
              ) : (
                <div className="space-y-4">

                  {/* OVERALL RESULT */}

                  <div
                    className={`alert ${
                      isRunSuccessful(runResult)
                        ? "alert-success"
                        : "alert-error"
                    }`}
                  >

                    <div className="w-full">

                      <h3 className="font-bold text-lg">
                        {isRunSuccessful(runResult)
                          ? "✓ All test cases passed!"
                          : "✕ Some test cases failed"}
                      </h3>

                      {runResult.error && (
                        <p className="mt-2">
                          {formatValue(
                            runResult.error
                          )}
                        </p>
                      )}

                      <div className="text-sm mt-2 space-y-1">

                        <p>
                          Runtime:{" "}
                          {runResult.runtime ?? 0} sec
                        </p>

                        <p>
                          Memory:{" "}
                          {runResult.memory ?? 0} KB
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* TEST CASES */}

                  <div className="space-y-4">

                    {Array.isArray(
                      runResult.testCases
                    ) &&
                      runResult.testCases.map(
                        (testCase, index) => {

                          const passed =
                            isTestCasePassed(
                              testCase
                            );

                          const input =
                            getTestCaseValue(
                              testCase,
                              [
                                "stdin",
                                "input",
                              ]
                            );

                          const expectedOutput =
                            getTestCaseValue(
                              testCase,
                              [
                                "expected_output",
                                "expectedOutput",
                                "expected",
                              ]
                            );

                          const actualOutput =
                            getTestCaseValue(
                              testCase,
                              [
                                "stdout",
                                "actualOutput",
                                "actual",
                                "userOutput",
                              ]
                            );

                          return (
                            <div
                              key={index}
                              className="border border-base-300 rounded-lg overflow-hidden"
                            >

                              {/* HEADER */}

                              <div className="bg-base-200 px-4 py-3 flex justify-between items-center">

                                <h4 className="font-semibold">
                                  Test Case{" "}
                                  {index + 1}
                                </h4>

                                <span
                                  className={`badge ${
                                    passed
                                      ? "badge-success"
                                      : "badge-error"
                                  }`}
                                >
                                  {passed
                                    ? "Passed"
                                    : "Failed"}
                                </span>

                              </div>

                              {/* BODY */}

                              <div className="p-4 space-y-4">

                                {/* INPUT */}

                                <div>

                                  <p className="font-semibold mb-2">
                                    Input
                                  </p>

                                  <pre className="bg-base-300 p-3 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                                    {formatValue(
                                      input
                                    )}
                                  </pre>

                                </div>

                                {/* EXPECTED */}

                                <div>

                                  <p className="font-semibold mb-2">
                                    Expected Output
                                  </p>

                                  <pre className="bg-base-300 p-3 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                                    {formatValue(
                                      expectedOutput
                                    )}
                                  </pre>

                                </div>

                                {/* ACTUAL */}

                                <div>

                                  <p className="font-semibold mb-2">
                                    Your Output
                                  </p>

                                  <pre className="bg-base-300 p-3 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                                    {formatValue(
                                      actualOutput
                                    )}
                                  </pre>

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                    {(!Array.isArray(
                      runResult.testCases
                    ) ||
                      runResult.testCases.length ===
                        0) && (
                      <p className="text-gray-500">
                        No testcase results returned
                        from the backend.
                      </p>
                    )}

                  </div>

                </div>
              )}

            </div>
          )}

          {/* =================================================
              RESULT TAB
          ================================================= */}

          {activeRightTab === "result" && (
            <div className="flex-1 p-4 overflow-y-auto">

              <h3 className="font-semibold mb-4">
                Submission Result
              </h3>

              {submitResult ? (
                <div
                  className={`alert ${
                    submitResult.accepted
                      ? "alert-success"
                      : "alert-error"
                  }`}
                >

                  <div>

                    {submitResult.accepted ? (
                      <div>

                        <h4 className="font-bold text-lg">
                          🎉 Accepted
                        </h4>

                        <div className="mt-4 space-y-2">

                          <p>
                            Test Cases Passed:{" "}
                            {
                              submitResult.passedTestCases
                            }
                            /
                            {
                              submitResult.totalTestCases
                            }
                          </p>

                          <p>
                            Runtime:{" "}
                            {submitResult.runtime ?? 0} sec
                          </p>

                          <p>
                            Memory:{" "}
                            {submitResult.memory ?? 0} KB
                          </p>

                        </div>

                      </div>
                    ) : (
                      <div>

                        <h4 className="font-bold text-lg">
                          ❌{" "}
                          {submitResult.error ||
                            "Wrong Answer"}
                        </h4>

                        <div className="mt-4 space-y-2">

                          <p>
                            Test Cases Passed:{" "}
                            {
                              submitResult.passedTestCases
                            }
                            /
                            {
                              submitResult.totalTestCases
                            }
                          </p>

                          <p>
                            Runtime:{" "}
                            {submitResult.runtime ?? 0} sec
                          </p>

                          <p>
                            Memory:{" "}
                            {submitResult.memory ?? 0} KB
                          </p>

                        </div>

                      </div>
                    )}

                  </div>

                </div>
              ) : (
                <p className="text-gray-500">
                  Click "Submit" to submit your
                  solution for evaluation.
                </p>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ProblemPage;