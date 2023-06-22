import os from "node:os";
import { NodeEnv } from "../types";

export const cpuLen = os.cpus().length;

export const nodeEnv: NodeEnv = {
  production: "production",
  development: "development",
};
