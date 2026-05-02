import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditor({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  surface = "default",
}) {
  const isDark = surface === "dark";
  const shell = isDark
    ? "bg-[#1e1e1e] border-[#3c3c3c] text-[#e0e0e0]"
    : "bg-base-100 border-base-300";
  const outer = isDark ? "bg-[#1e1e1e]" : "bg-base-300";
  const selectCls = isDark
    ? "select select-sm select-bordered border-[#555] bg-[#2d2d2d] text-white"
    : "select select-sm";

  return (
    <div className={`h-full flex flex-col ${outer}`}>
      <div className={`flex items-center justify-between px-4 py-3 border-b rounded-none ${shell}`}>
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt="LANGUAGE_CONFIG[selectedLanguage].name"
            className="size-6 object-contain"
          />
          <select
            className={selectCls}
            value={selectedLanguage}
            onChange={onLanguageChange}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary btn-sm gap-2"
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="size-4 " />
              Run Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 18,
            lineHeight: 26,
            padding: { top: 16, bottom: 16 },

            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },

            wordWrap: "on",
            renderLineHighlight: "all",
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
