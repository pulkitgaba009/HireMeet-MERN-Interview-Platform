import Question from "../models/QuestionModel.js";

// ================= GET =================
const getQuestions = async (req, res) => {
  try {
    const data = await Question.find();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= POST =================
const addQuestion = async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body);

    res.status(201).json({
      success: true,
      question: newQuestion,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Question with this ID already exists",
      });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= DELETE (FIXED) =================
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Question.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= UPDATE (FIXED) =================
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Question.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      message: "Updated successfully",
      question: updated,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getQuestions, addQuestion, deleteQuestion, updateQuestion };
