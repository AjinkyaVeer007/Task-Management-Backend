import express from "express";
import { createProject } from "../controller/project.controller.js";

const router = express.Router();

router.post("/create", createProject);

export default router;
