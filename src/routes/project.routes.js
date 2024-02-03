import express from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controller/project.controller.js";

const router = express.Router();

router.post("/create", createProject);
router.get("/:userId", getProjects);
router.put("/update/:id", updateProject);
router.delete("/delete/:id", deleteProject);

export default router;
