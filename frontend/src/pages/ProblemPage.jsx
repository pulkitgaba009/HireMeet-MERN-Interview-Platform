import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PROBLEMS } from "../data/problems";
import NavBar from "../components/NavBar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";

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

  const [selectedLanguage, setSelectedLanguage] =
    useState("javascript");
  const [code, setCode] = useState(
    problem.starterCode.javascript
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Sync code when problem or language changes
  useEffect(() => {
    setCode(problem.starterCode[selectedLanguage]);
    setOutput(null);
  }, [id, selectedLanguage]);

  const handleProblemChange = (newProblemId) => {
    navigate(`/problems/${newProblemId}`);
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
                  code={code}
                  language={selectedLanguage}
                  onChange={setCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary cursor-row-resize" />

              <Panel defaultSize={30} minSize={20}>
                <OutputPanel
                  output={output}
                  isRunning={isRunning}
                />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
