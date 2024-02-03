import express from "express";
import {
  createProject,
  getProjects,
} from "../controller/project.controller.js";

const router = express.Router();

router.post("/create", createProject);
router.get("/:userId", getProjects);

export default router;
