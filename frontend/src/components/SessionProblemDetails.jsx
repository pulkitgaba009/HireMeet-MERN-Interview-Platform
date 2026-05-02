import { Loader2Icon, PhoneOffIcon } from "lucide-react";
import { getDifficulyBadgeClass } from "../lib/utils";

function formatDifficultyLabel(d) {
  if (d == null || d === "") return "—";
  const s = String(d);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function SessionProblemDetails({
  problem,
  session,
  isHost,
  participantCount,
  onEndSession,
  endSessionPending,
}) {
  const hostName = session?.host?.name || "Host";

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#e0e0e0]">
      <div className="shrink-0 p-4 border-b border-[#333]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">
              {problem?.title ?? session?.problem ?? "Problem"}
            </h1>
            {problem?.category && (
              <p className="text-sm text-[#9e9e9e] mt-1">{problem.category}</p>
            )}
            <p className="text-sm text-[#b0b0b0] mt-2">
              Host: {hostName}
              <span className="text-[#888]">
                {" "}
                · {participantCount}/2 participants
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`badge border-0 ${getDifficulyBadgeClass(
                problem?.difficulty ?? session?.difficulty ?? "easy",
              )}`}
            >
              {formatDifficultyLabel(
                problem?.difficulty ?? session?.difficulty ?? "",
              )}
            </span>
            {isHost && (
              <button
                type="button"
                onClick={onEndSession}
                disabled={endSessionPending}
                className="btn btn-sm btn-error gap-2"
              >
                {endSessionPending ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <PhoneOffIcon className="size-4" />
                )}
                End session
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <section className="rounded-lg bg-[#252526] border border-[#333] p-4">
          <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
          {problem?.description?.text ? (
            <p className="text-[#ccc] leading-relaxed text-sm">
              {problem.description.text}
            </p>
          ) : (
            <p className="text-[#888] text-sm">No description available.</p>
          )}
          {(problem?.description?.notes || []).map((note, idx) => (
            <p key={idx} className="text-[#bbb] text-sm mt-2">
              {note}
            </p>
          ))}
        </section>

        {problem?.examples?.length > 0 && (
          <section className="rounded-lg bg-[#252526] border border-[#333] p-4">
            <h2 className="text-lg font-semibold text-white mb-3">Examples</h2>
            <div className="space-y-4">
              {problem.examples.map((example, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium text-[#aaa] mb-2">
                    Example {idx + 1}
                  </p>
                  <div className="bg-[#1e1e1e] rounded-md p-3 font-mono text-xs space-y-1.5 text-[#d4d4d4]">
                    <div className="flex gap-2">
                      <span className="text-primary font-bold shrink-0 w-14">Input:</span>
                      <span className="break-all">{example.input}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold shrink-0 w-14">Output:</span>
                      <span className="break-all">{example.output}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {problem?.constraints?.length > 0 && (
          <section className="rounded-lg bg-[#252526] border border-[#333] p-4">
            <h2 className="text-lg font-semibold text-white mb-3">Constraints</h2>
            <ul className="space-y-2 text-sm text-[#ccc]">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <code className="text-[#ce9178] break-all">{constraint}</code>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

export default SessionProblemDetails;
