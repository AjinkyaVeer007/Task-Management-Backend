import express from "express";
import {
  changePassword,
  login,
  logout,
  register,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/changepassword", changePassword);

export default router;
