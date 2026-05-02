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
    <div className="h-full flex flex-col bg-base-200 text-base-content">
      <div className="shrink-0 p-4 sm:p-6 bg-base-100 border-b border-base-300">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content truncate">
              {problem?.title ?? session?.problem ?? "Problem"}
            </h1>
            {problem?.category && (
              <p className="text-sm text-base-content/60 mt-1">{problem.category}</p>
            )}
            <p className="text-sm text-base-content/70 mt-2">
              Host: {hostName}
              <span className="text-base-content/50">
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

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <section className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold text-base-content mb-2">Description</h2>
          {problem?.description?.text ? (
            <p className="text-base-content/90 leading-relaxed">
              {problem.description.text}
            </p>
          ) : (
            <p className="text-base-content/50 text-sm">No description available.</p>
          )}
          {(problem?.description?.notes || []).map((note, idx) => (
            <p key={idx} className="text-base-content/80 mt-2">
              {note}
            </p>
          ))}
        </section>

        {problem?.examples?.length > 0 && (
          <section className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
            <h2 className="text-xl font-bold text-base-content mb-4">Examples</h2>
            <div className="space-y-4">
              {problem.examples.map((example, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-sm">{idx + 1}</span>
                    <p className="font-semibold text-base-content">
                      Example {idx + 1}
                    </p>
                  </div>
                  <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5 text-base-content/90">
                    <div className="flex gap-2">
                      <span className="text-primary font-bold min-w-[70px] shrink-0">
                        Input:
                      </span>
                      <span className="break-all">{example.input}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold min-w-[70px] shrink-0">
                        Output:
                      </span>
                      <span className="break-all">{example.output}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {problem?.constraints?.length > 0 && (
          <section className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
            <h2 className="text-xl font-bold text-base-content mb-4">Constraints</h2>
            <ul className="space-y-2 text-base-content/90">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <code className="text-sm break-all">{constraint}</code>
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
