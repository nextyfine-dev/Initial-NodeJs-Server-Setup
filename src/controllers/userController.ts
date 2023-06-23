import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createOrFindUser,
  findUser,
  generateRefreshToken,
  generateToken,
  verifyToken,
} from "../services/userService.js";
import { sendSuccessRes } from "../services/serverService.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { AuthUserDetails } from "../types/controllerTypes.js";

export const signUpOrSignIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, password }: AuthUserDetails = req.body;

    const user = await createOrFindUser(userName, password);

    if (!user)
      return next(
        new AppError("Invalid username or password!", StatusCodes.BAD_REQUEST)
      );

    const token = generateToken({
      id: user.id,
      userName: user.userName,
      password: user.password,
    });

    const refreshToken = generateRefreshToken(user.id);

    return sendSuccessRes(
      res,
      "LoggedIn Successfully!",
      { token, refreshToken },
      user.isCreated ? StatusCodes.CREATED : StatusCodes.OK
    );
  }
);

export const refreshTheToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken }: { refreshToken: string } = req.body;

    const decoded = verifyToken(refreshToken, "refresh");

    if (!decoded)
      return next(new AppError("Please login again!", StatusCodes.BAD_REQUEST));

    console.log("decoded :>> ", decoded);
  }
);
