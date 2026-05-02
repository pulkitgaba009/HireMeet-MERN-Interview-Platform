function OutputPanel({ output, isRunning, surface = "default" }) {
  const isDark = surface === "dark";
  const header = isDark
    ? "px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] font-semibold text-sm text-[#e0e0e0]"
    : "px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm";
  const body = isDark ? "bg-[#1e1e1e] text-[#ccc]" : "";
  const muted = isDark ? "text-[#888]" : "text-base-content/50";

  return (
    <div className={`h-full flex flex-col ${isDark ? "bg-[#1e1e1e]" : "bg-base-100"}`}>
      <div className={header}>Output</div>

      <div className={`flex-1 overflow-auto p-4 ${body}`}>
        {isRunning ? (
          <p className={`${muted} text-sm`}>Running...</p>
        ) : !output ? (
          <p className={`${muted} text-sm`}>
            Click &quot;Run Code&quot; to see the output here...
          </p>
        ) : (
          <pre className="text-sm font-mono whitespace-pre-wrap">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
