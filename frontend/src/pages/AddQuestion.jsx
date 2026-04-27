import { useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { getDifficulyBadgeClass } from "../lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/dist/esm";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function AddQuestion() {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    difficulty: "Easy",
    category: [],
    description: { text: "", notes: [] },
    examples: [{ input: "", output: "" }],
    constraints: [""],
    starterCode: {
      javascript: "",
      python: "",
      java: "",
      c: "",
      cpp: "",
    },

    // 🔥 ADDED
    expectedOutput: {
      javascript: "",
      python: "",
      java: "",
      c: "",
      cpp: "",
    },
  });

  const [loading, setLoading] = useState(false);

  // ================= HANDLERS =================
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescription = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: { ...prev.description, text: value },
    }));
  };

  const updateArray = (key, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = (key, item) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], item],
    }));
  };

  const updateConstraints = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      constraints: prev.constraints.map((c, i) =>
        i === index ? value : c
      ),
    }));
  };

  const updateStarterCode = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      starterCode: {
        ...prev.starterCode,
        [lang]: value,
      },
    }));
  };

  // 🔥 NEW HANDLER
  const updateExpectedOutput = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      expectedOutput: {
        ...prev.expectedOutput,
        [lang]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post("/questions", formData);
      toast.success("Question Added 🚀");
    } catch {
      toast.error("Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[80vh] text-base-content gap-5">

      {/* ================= PREVIEW ================= */}
      <div className="w-1/2 overflow-auto px-6 py-4 space-y-6 scrollbar-hide bg-black/70 backdrop-blur-xl rounded-2xl border border-base-300">
        <h2 className="text-2xl font-bold text-primary py-2">
          Live Preview
        </h2>

        {/* HEADER */}
        <div className="card bg-base-100/80 backdrop-blur border border-base-300 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">
              {formData.title || "Problem Title"}
            </h3>
            <span
              className={`${getDifficulyBadgeClass(
                formData.difficulty
              )} px-4 rounded-full w-fit`}
            >
              {formData.difficulty}
            </span>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="card bg-base-100/80 border border-base-300 shadow-xl">
          <div className="card-body">
            <h3 className="text-primary font-semibold text-lg">
              Description
            </h3>
            <p className="opacity-80 whitespace-pre-line">
              {formData.description.text || "No description"}
            </p>
          </div>
        </div>

        {/* EXAMPLES */}
        <div className="card bg-base-100/80 border border-base-300 shadow-xl">
          <div className="card-body">
            <h3 className="text-primary font-semibold text-lg">
              Examples
            </h3>

            {formData.examples.map((ex, i) => (
              <div key={i} className="bg-base-200 p-4 rounded-xl mt-2">
                <p><b>Input:</b> {ex.input || "—"}</p>
                <p><b>Output:</b> {ex.output || "—"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="card bg-base-100/80 border border-base-300 shadow-xl">
          <div className="card-body">
            <h3 className="text-primary font-semibold text-lg">
              Constraints
            </h3>
            {formData.constraints.map((c, i) => (
              <p key={i}>• {c || "—"}</p>
            ))}
          </div>
        </div>

        {/* CODE */}
        {Object.keys(formData.starterCode).map((lang) => (
          <div key={lang} className="card bg-base-100/80 border border-base-300 shadow-xl">
            <div className="card-body">
              <h3 className="capitalize text-primary">{lang}</h3>
              <SyntaxHighlighter language={lang} style={atomDark}>
                {formData.starterCode[lang] || "// no code"}
              </SyntaxHighlighter>
            </div>
          </div>
        ))}

        {/* 🔥 EXPECTED OUTPUT PREVIEW */}
        {Object.keys(formData.expectedOutput).map((lang) => (
          <div key={lang} className="card bg-base-100/80 border border-base-300 shadow-xl">
            <div className="card-body">
              <h3 className="capitalize text-primary">
                Expected Output ({lang})
              </h3>
              <SyntaxHighlighter language="text" style={atomDark}>
                {formData.expectedOutput[lang] || "// no output"}
              </SyntaxHighlighter>
            </div>
          </div>
        ))}
      </div>

      {/* ================= FORM ================= */}
      <div className="w-1/2 overflow-auto px-6 py-4 space-y-6 bg-black/70 backdrop-blur-xl scrollbar-hide rounded-2xl border border-base-300">

  <h2 className="text-2xl font-bold text-primary">Add Question</h2>

  {/* ================= BASIC INFO ================= */}
  <div className="card bg-base-100/80 border border-base-300 shadow-xl">
    <div className="card-body space-y-4">

      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-primary">Basic Info</h3>
        <span className="badge badge-outline badge-warning">Required</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          name="id"
          placeholder="Problem ID (two-sum)"
          value={formData.id}
          onChange={handleBasicChange}
          className="inputField"
        />

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleBasicChange}
          className="inputField"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <input
        name="title"
        placeholder="Enter problem title"
        value={formData.title}
        onChange={handleBasicChange}
        className="inputField"
      />

      <textarea
        placeholder="Write full problem description..."
        value={formData.description.text}
        onChange={(e) => handleDescription(e.target.value)}
        className="inputField h-32"
      />

      <p className="text-xs opacity-60">
        Tip: Use clear examples and constraints
      </p>
    </div>
  </div>

  {/* ================= EXAMPLES ================= */}
  <div className="card bg-base-100/80 border border-base-300 shadow-xl">
    <div className="card-body space-y-4">
      <h3 className="text-primary font-semibold">Examples</h3>

      {formData.examples.map((ex, i) => (
        <div key={i} className="grid grid-cols-2 gap-4">
          <input
            value={ex.input}
            placeholder="Input"
            onChange={(e) =>
              updateArray("examples", i, "input", e.target.value)
            }
            className="inputField"
          />
          <input
            value={ex.output}
            placeholder="Output"
            onChange={(e) =>
              updateArray("examples", i, "output", e.target.value)
            }
            className="inputField"
          />
        </div>
      ))}

      <button
        onClick={() =>
          addItem("examples", { input: "", output: "" })
        }
        className="btn btn-sm btn-success w-fit"
      >
        + Add Example
      </button>
    </div>
  </div>

  {/* ================= CONSTRAINTS ================= */}
  <div className="card bg-base-100/80 border border-base-300 shadow-xl">
    <div className="card-body space-y-4">
      <h3 className="text-primary font-semibold">Constraints</h3>

      {formData.constraints.map((c, i) => (
        <input
          key={i}
          value={c}
          onChange={(e) =>
            updateConstraints(i, e.target.value)
          }
          placeholder="Constraint"
          className="inputField"
        />
      ))}

      <button
        onClick={() => addItem("constraints", "")}
        className="btn btn-sm btn-success w-fit"
      >
        + Add Constraint
      </button>
    </div>
  </div>

  {/* ================= CODE ================= */}
  <div className="card bg-base-100/80 border border-base-300 shadow-xl">
    <div className="card-body space-y-4">
      <h3 className="text-primary font-semibold">Starter Code</h3>

      {Object.keys(formData.starterCode).map((lang) => (
        <div key={lang}>
          <label className="text-sm text-primary capitalize">
            {lang}
          </label>
          <textarea
            value={formData.starterCode[lang]}
            onChange={(e) =>
              updateStarterCode(lang, e.target.value)
            }
            className="inputField h-28 font-mono"
          />
        </div>
      ))}
    </div>
  </div>

  {/* ================= EXPECTED OUTPUT ================= */}
  <div className="card bg-base-100/80 border border-base-300 shadow-xl">
    <div className="card-body space-y-4">
      <h3 className="text-primary font-semibold">
        Expected Output
      </h3>

      {Object.keys(formData.expectedOutput).map((lang) => (
        <div key={lang}>
          <label className="text-sm text-primary capitalize">
            {lang}
          </label>
          <textarea
            value={formData.expectedOutput[lang]}
            onChange={(e) =>
              updateExpectedOutput(lang, e.target.value)
            }
            className="inputField h-24 font-mono"
          />
        </div>
      ))}
    </div>
  </div>

  {/* ================= SUBMIT ================= */}
  <button
    onClick={handleSubmit}
    className="w-full py-3 rounded-xl bg-primary text-primary-content font-semibold hover:scale-[1.02] transition-all"
  >
    {loading ? "Saving..." : "Save Question"}
  </button>
</div>
    </div>
  );
}

export default AddQuestion;