import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

export const __fileName = (url = import.meta.url) => fileURLToPath(url);

export const __dirname = (fileName = __fileName()) => dirname(fileName);

const envPath = path.resolve(__dirname(), ".env");

dotenv.config({ path: envPath });

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || "3030";
export const NODE_VERSION = process.versions.node;
export const NODE_V = parseInt(process.versions.node.split(".")[0]);
