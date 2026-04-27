import express from "express";
import { addQuestion, deleteQuestion, getQuestions, updateQuestion } from "../controller/questionController.js";

const router = express.Router();

router.get("/",getQuestions);

router.post("/",addQuestion);

router.delete("/:id",deleteQuestion);

router.put("/:id",updateQuestion);


export default router;