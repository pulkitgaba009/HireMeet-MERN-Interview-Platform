import { PROBLEMS } from "../data/problems";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import { Code2Icon } from "lucide-react";
import { getDifficulyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);
  const easyProblemsCount = problems.filter(p=>p.difficulty==="Easy").length;
  const mediumProblemsCount = problems.filter(p=>p.difficulty==="Medium").length
  const hardProblemsCount = problems.filter(p=>p.difficulty==="Hard").length


  return (
    <div>
      <NavBar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-base-content/70">
            Sharpen your coding skills with these curated problems
          </p>
        </div>
        {/* Problems */}
        <div className="space-y-4">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problems/${problem.id}`}
              className="group block"
            >
              <div className="card bg-base-100 border border-base-300 shadow-sm transition-all duration-200 group-hover:shadow-lg group-hover:border-primary/40 group-hover:scale-[1.01]">
                <div className="card-body py-5">
                  <div className="flex items-center justify-between gap-6">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Code2Icon className="size-6 text-primary" />
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-lg font-semibold group-hover:text-primary transition">
                            {problem.title}
                          </h2>

                          <span
                            className={`badge badge-sm ${getDifficulyBadgeClass(
                              problem.difficulty,
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>

                        <p className="text-sm text-base-content/60">
                          {problem.category}
                        </p>

                        <p className="text-sm text-base-content/40">
                          {problem?.description?.text}
                        </p>
                      </div>
                    </div>

                    {/* Right Arrow */}
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <span className="text-primary text-xl">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
                <div className="stat">
                  <div className="stat-title">Total Problems</div>
                  <div className="stat-value text-primary">{problems.length}</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Easy</div>
                  <div className="stat-value text-success">{easyProblemsCount}</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Medium</div>
                  <div className="stat-value text-warning">{mediumProblemsCount}</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Hard</div>
                  <div className="stat-value text-error">{hardProblemsCount}</div>
                </div>
               
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProblemsPage;
