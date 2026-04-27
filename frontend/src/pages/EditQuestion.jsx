import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { getDifficulyBadgeClass } from "../lib/utils";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter/dist/esm";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function EditQuestion() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [formData, setFormData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await api.get("/questions");
        setQuestions(data);
        setSelectedQuestion(data[0] || null);
      } catch {
        toast.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (selectedQuestion) {
      setFormData(JSON.parse(JSON.stringify(selectedQuestion)));
    }
  }, [selectedQuestion]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  // 🔥 NEW
  const updateExpectedOutput = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      expectedOutput: {
        ...prev.expectedOutput,
        [lang]: value,
      },
    }));
  };

  // ================= API =================
  const updateQuestion = async () => {
    try {
      setUpdating(true);
      await api.put(`/questions/${formData._id}`, formData);

      const { data } = await api.get("/questions");
      setQuestions(data);

      toast.success("Updated ✅");
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setUpdating(false);
    }
  };

  const deleteQuestion = async () => {
    try {
      setDeleting(true);
      await api.delete(`/questions/${formData._id}`);

      setQuestions((prev) => prev.filter((q) => q._id !== formData._id));

      toast.success("Deleted 🗑️");
    } catch {
      toast.error("Delete failed ❌");
    } finally {
      setDeleting(false);
    }
  };

  // ================= EMPTY STATE =================
  if (loading) return <div className="p-10">Loading...</div>;

  if (!questions.length) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-red-500">
            No Questions Found ❌
          </h2>
          <p className="text-base-content/70">Please add a question first</p>
        </div>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div>
      <div className="flex gap-4 h-[80vh]">
        {/* ================= LEFT: PREVIEW ================= */}
        <div className="w-1/2 overflow-auto p-6 space-y-6 bg-black/70 backdrop-blur-xl rounded-2xl border border-base-300 scrollbar-hide">
          <h2 className="text-2xl font-bold text-white">Live Preview</h2>

          {/* TITLE */}
          <div className="card bg-base-100/80 border border-base-300 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-primary">
                {formData.title || "Problem Title"}
              </h3>

              <span
                className={`${getDifficulyBadgeClass(
                  formData.difficulty,
                )} px-4 rounded-full w-fit`}
              >
                {formData.difficulty}
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="card bg-base-100/80 border border-base-300 shadow-xl">
            <div className="card-body">
              <h3 className="text-white font-semibold">Description</h3>
              <p className="text-base-content/80">
                {formData.description?.text || "No description"}
              </p>
            </div>
          </div>

          {/* CODE PREVIEW */}
          {Object.entries(formData.starterCode)
            .filter(([_, code]) => code?.trim() !== "")
            .map(([lang, code]) => (
              <div
                key={lang}
                className="card bg-base-100/80 border border-base-300 shadow-xl"
              >
                <div className="card-body">
                  <h3 className="capitalize text-primary">{lang}</h3>
                  <SyntaxHighlighter language={lang} style={atomDark}>
                    {code}
                  </SyntaxHighlighter>
                </div>
              </div>
            ))}

          {/* 🔥 EXPECTED OUTPUT PREVIEW */}
          {formData.expectedOutput &&
            Object.entries(formData.expectedOutput)
              .filter(([_, code]) => code?.trim() !== "")
              .map(([lang, code]) => (
                <div
                  key={lang}
                  className="card bg-base-100/80 border border-base-300 shadow-xl"
                >
                  <div className="card-body">
                    <h3 className="capitalize text-primary">
                      Expected Output ({lang})
                    </h3>
                    <SyntaxHighlighter language="text" style={atomDark}>
                      {code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              ))}
        </div>

        {/* DIVIDER */}
        <div className="w-[1px] bg-base-300 opacity-40" />

        {/* ================= RIGHT ================= */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* SELECTOR */}
          <div className="bg-black/70 backdrop-blur-xl p-4 rounded-2xl border border-base-300 flex flex-wrap gap-4 scrollbar-hide">
            {questions.map((q, i) => {
              const isActive = q._id === selectedQuestion?._id;

              return (
                <button
                  key={q._id}
                  onClick={() => setSelectedQuestion(q)}
                  className={`w-14 h-14 text-lg font-semibold rounded-full flex items-center justify-center
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary text-primary-content scale-105"
                        : "bg-black/60 border border-white/10 text-base-content hover:bg-base-200 hover:scale-105"
                    }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* FORM */}
          <div className="flex-1 overflow-auto bg-black/70 backdrop-blur-xl p-6 rounded-2xl border border-base-300 space-y-6 scrollbar-hide">
            <h2 className="text-xl font-bold text-white">Edit Question</h2>

            {/* ================= BASIC INFO ================= */}
            <div className="card bg-base-100/80 border border-base-300 shadow-xl">
              <div className="card-body space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-primary">
                    Basic Info
                  </h3>
                  <span className="badge badge-outline badge-warning">
                    Edit
                  </span>
                </div>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="inputField"
                  placeholder="Title"
                />

                <textarea
                  value={formData.description.text}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: {
                        ...prev.description,
                        text: e.target.value,
                      },
                    }))
                  }
                  className="inputField h-32"
                  placeholder="Description"
                />
              </div>
            </div>

            {/* ================= STARTER CODE ================= */}
            <div className="card bg-base-100/80 border border-base-300 shadow-xl">
              <div className="card-body space-y-4">
                <h3 className="text-primary font-semibold">Starter Code</h3>

                <div className="grid grid-cols-2 gap-4">
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
                        className="inputField h-28 font-mono text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ================= EXPECTED OUTPUT ================= */}
            <div className="card bg-base-100/80 border border-base-300 shadow-xl">
              <div className="card-body space-y-4">
                <h3 className="text-primary font-semibold">Expected Output</h3>

                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(formData.expectedOutput || {}).map((lang) => (
                    <div key={lang}>
                      <label className="text-sm text-primary capitalize">
                        {lang}
                      </label>

                      <textarea
                        value={formData.expectedOutput?.[lang] || ""}
                        onChange={(e) =>
                          updateExpectedOutput(lang, e.target.value)
                        }
                        className="inputField h-24 font-mono text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ================= ACTION BUTTONS ================= */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={updateQuestion}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-content font-semibold hover:scale-[1.02] transition"
              >
                {updating ? "Updating..." : "Update"}
              </button>

              <button
                onClick={deleteQuestion}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold hover:scale-[1.02] transition"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditQuestion;
