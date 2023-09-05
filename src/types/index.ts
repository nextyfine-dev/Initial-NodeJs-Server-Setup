import { Dialect } from "sequelize";

export type NodeEnv = {
  production: "production";
  development: "development";
};

export type DbConfig = {
  database: string;
  username: string;
  password: string;
  options: {
    host: string;
    dialect: Dialect;
    timezone: string;
  };
};

export interface Err extends Error {
  code?: string | number;
  message: string;
  statusCode: number;
  status: string;
  isOperational?: boolean;
  path?: string;
  value?: unknown;
  errors?: any;
  body?: any;
  query?: any;
  params?: any;
  err?: any;
}

export type ValidateReqType = "body" | "params" | "query";
export type ValidateType = "single" | "multiple";
