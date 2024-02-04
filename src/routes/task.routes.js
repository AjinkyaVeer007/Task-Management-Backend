import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
} from "../controller/task.controller.js";

const router = express.Router();

router.post("/create", createTask);
router.post("/update/:id", updateTask);
router.get("/:userId/:projectId", getTasks);

export default router;
