function OutputPanel({ output, isRunning }) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
        Output
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isRunning ? (
          <p className="text-base-content/50 text-sm">Running...</p>
        ) : !output ? (
          <p className="text-base-content/50 text-sm">
            Click "Run Code" to see the output here...
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
