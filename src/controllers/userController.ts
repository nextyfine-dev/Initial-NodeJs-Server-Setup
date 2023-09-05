import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
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
import { AuthUserDetails, UserDetails } from "../types/controllerTypes.js";

export const signUpOrSignIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, password }: AuthUserDetails = req.body;

    const user = await createOrFindUser(userName, password);

    if (!user)
      return next(
        new AppError("Invalid username or password!", StatusCodes.BAD_REQUEST)
      );

    const token = generateToken(user);

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

    const decoded = verifyToken(refreshToken, "refresh") as JwtPayload;

    if (!decoded)
      return next(new AppError("Please login again!", StatusCodes.BAD_REQUEST));

    const user = await findUser(decoded.id);

    if (!user)
      return next(
        new AppError(
          "Invalid authentication! Please login again.",
          StatusCodes.NON_AUTHORITATIVE_INFORMATION,
          undefined,
          "Authentication Error"
        )
      );

    const userDetails: UserDetails = user.dataValues;

    const token = generateToken(userDetails);

    const newRefreshToken = generateRefreshToken(userDetails.id);

    return sendSuccessRes(res, "LoggedIn Successfully!!", {
      token,
      refreshToken: newRefreshToken,
    });
  }
);

export const loginWithToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
