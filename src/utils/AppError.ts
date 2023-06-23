import { Err } from "../types";

class AppError implements Err {
  message: string;
  statusCode: number;
  status: string;
  isOperational: boolean;
  errName?: string;
  code?: string | number;
  name: string;
  err?: any;

  constructor(
    message: string,
    statusCode: number,
    err?: any,
    name?: string,
    code?: string | number
  ) {
    // super(message);

    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.name = name || "App Error";
    this.code = code;
    this.err = err;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
