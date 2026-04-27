import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
});

const starterCodeSchema = new mongoose.Schema({
  javascript: String,
  python: String,
  java: String,
  c: String,
  cpp: String,
});

const expectedOutputSchema = new mongoose.Schema({
  javascript: String,
  python: String,
  java: String,
  c: String,
  cpp: String,
});

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    category: [
      {
        type: String,
      },
    ], 

    description: {
      text: { type: String, required: true },
      notes: [{ type: String }],
    },

    examples: [exampleSchema],

    constraints: [{ type: String }],

    starterCode: starterCodeSchema,

    expectedOutput: expectedOutputSchema,
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;