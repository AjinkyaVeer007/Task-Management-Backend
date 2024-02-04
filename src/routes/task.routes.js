import express from "express";
import { createTask } from "../controller/task.controller.js";

const router = express.Router();

router.post("/create", createTask);

export default router;
