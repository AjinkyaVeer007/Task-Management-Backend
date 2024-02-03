import express from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controller/project.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", auth, createProject);
router.get("/:userId", auth, getProjects);
router.put("/update/:id", auth, updateProject);
router.delete("/delete/:id", auth, deleteProject);

export default router;
