import express from "express";
import { authValidation } from "../middlewares/validations.js";
import { signUpOrSignIn } from "../controllers/userController.js";

const router = express.Router();

router.post("/auth", authValidation, signUpOrSignIn);

export default router;
