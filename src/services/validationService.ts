import Validator, {
  ValidationError,
  ValidationSchema,
} from "fastest-validator";
import AppError from "../utils/AppError.js";
import { ValidateReqType, ValidateType } from "../types/index.js";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";

const validationError = (message: string, details?: ValidationError[]) => {
  throw new AppError(message, 400, details, "Validation Error");
};

export const validateRequest = async (
  req: Request,
  schema: ValidationSchema,
  reqType?: ValidateReqType,
  type?: ValidateType
) => {
  const validator = new Validator();

  let validate: true | ValidationError[] = [];

  if (type === "single" && reqType) {
    validate = await validator.validate(req[reqType], schema);
  } else if (type === "multiple") {
    for (const key of Object.keys(schema)) {
      validate = await validator.validate(
        req[key as ValidateReqType],
        schema[key]
      );
    }
  }

  if (validate === true) return true;

  validationError(validate[0].message || "Validation Failed", validate);
};

export const validate = (
  schema: Record<string, object>,
  reqType: ValidateReqType = "body",
  type: ValidateType = "single"
) => {
  return catchAsync(async (req: Request, _: Response, next: NextFunction) => {
    const isValid = await validateRequest(req, schema, reqType, type);
    if (isValid) {
      next();
    }
  });
};
