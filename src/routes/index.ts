import express from "express";
import {
  authValidation,
  refreshTokenValidation,
} from "../middlewares/validations.js";
import {
  refreshTheToken,
  signUpOrSignIn,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/auth", authValidation, signUpOrSignIn);
router.post("/auth/refresh", refreshTokenValidation, refreshTheToken);

export default router;
