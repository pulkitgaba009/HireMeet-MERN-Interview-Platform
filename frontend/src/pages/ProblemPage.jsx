import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import NavBar from "../components/NavBar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

/**
 * Render the problem-solving page with a navigable problem list, language-aware code editor, and output pane.
 *
 * Displays the selected problem's description, provides a code editor seeded with language-specific starter code,
 * lets the user run code, shows execution output, and verifies output against the problem's expected output
 * (triggering confetti and success toast on pass, or an error toast on failure). Also handles changing the
 * current problem and switching programming languages.
 *
 * @returns {JSX.Element} The rendered ProblemPage component.
 */
function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const problem = PROBLEMS[id];

  if (!problem) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-base-content/60">Problem not found</p>
      </div>
    );
  }

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problem.starterCode.javascript);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // Sync code when problem or language changes
  useEffect(() => {
    setCode(problem.starterCode[selectedLanguage]);
    setOutput("");
  }, [id, selectedLanguage, problem]);

  const handleProblemChange = (newProblemId) => {
    navigate(`/problems/${newProblemId}`);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(problem.starterCode[newLang]);
    setOutput("");
  };

  const normalizeOutput = (text) => {
    if (!text) return "";
    return text
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          .replace(/\s*,\s*/g, ","),
      )
      .filter(Boolean)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    return normalizeOutput(actualOutput) === normalizeOutput(expectedOutput);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setOutput("");

      const result = await executeCode(selectedLanguage, code);

      console.log("EXEC RESULT:", result);

      if (!result.success) {
        toast.error(result.error || "Runtime error");
        setOutput(result.output || "");
        return;
      }

      setOutput(result.output);

      const expectedOutput = problem.expectedOutput[selectedLanguage];

      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! 🎉");
      } else {
        toast.error("Tests failed. Check your output.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Execution error.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-base-100 flex flex-col">
      <NavBar />

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={problem}
              currentProblemId={id}
              onProblemChangeMethod={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary cursor-col-resize" />

          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={30}>
                <CodeEditor
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary cursor-row-resize" />

              <Panel defaultSize={30} minSize={20}>
                <OutputPanel output={output} isRunning={isRunning} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;