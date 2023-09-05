import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import dotenv from "dotenv";
import { Dialect } from "sequelize";
import { DbConfig } from "../types/index.js";

export const __fileName = (url = import.meta.url) => fileURLToPath(url);

export const __dirname = (fileName = __fileName()) => dirname(fileName);

const envPath = path.resolve(__dirname(), ".env");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  throw new Error(
    "Configuration file not found. Please configure the necessary files. Please add '.env' file inside the 'dist/config' folder!"
  );
}

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || "3030";
export const NODE_VERSION = process.versions.node;
export const NODE_V = parseInt(process.versions.node.split(".")[0]);

export const dbConfig: DbConfig = {
  database: process.env.DB_NAME || "",
  username: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  options: {
    host: process.env.HOST || "localhost",
    dialect: (process.env.DB_TYPE as Dialect) || "mysql",
    timezone: process.env.TIME_ZONE || "+05:30",
  },
};

export const JWT_SECRET = process.env.JWT_SECRET;
export const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

export const settings = {
  usingWs: false,
};
