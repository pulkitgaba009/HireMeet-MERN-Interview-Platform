import express from "express";
import { getRoute } from "../controller/controller.js";

const router = express.Router();

router.get("/",getRoute)

export default router