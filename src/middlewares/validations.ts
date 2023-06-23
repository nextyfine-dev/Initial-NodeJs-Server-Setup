import { NextFunction, Request, Response } from "express";
import Validator from "fastest-validator";
import { authSchema } from "../models/ValidationSchemas.js";
import AppError from "../utils/AppError.js";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync.js";

const validator = new Validator();

export const authValidation = catchAsync(
  async (req: Request, _: Response, next: NextFunction) => {
    const isValid = await validator.validate(req.body, authSchema);

    if (isValid !== true)
      return next(
        new AppError(
          "Valid username and valid password are required!",
          StatusCodes.BAD_REQUEST,
          isValid,
          "Authentication Error"
        )
      );

    next();
  }
);
