import cluster from "node:cluster";
import {
  IncomingMessage,
  Server as HttpServer,
  ServerResponse,
} from "node:http";
import { Response, Express } from "express";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events.js";
import { setupMaster, setupWorker } from "@socket.io/sticky";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
import figlet from "figlet";

import { NODE_V, NODE_VERSION, PORT } from "../config/index.js";
import { cpuLen } from "../config/constants.js";
import logger from "../logs/logger.js";

export const sendSuccessRes = (
  res: Response,
  message: String,
  data?: undefined | any,
  statusCode: StatusCodes = StatusCodes.OK
) =>
  res.status(statusCode).json({
    status: "success",
    statusCode,
    message,
    data,
  });

export const runOnThread = (
  app: Express | HttpServer<typeof IncomingMessage, typeof ServerResponse>,
  io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  if (
    (NODE_V >= 16 && cluster.isPrimary) ||
    (NODE_V < 16 && cluster.isMaster)
  ) {
    initialStartMsg();
    logger.info(`Primary is running`);

    if (io && app instanceof HttpServer) {
      logger.info(`Running socket on Primary`);

      setupMaster(app, {
        loadBalancingMethod: "least-connection",
      });

      setupPrimary();
    }

    if (NODE_V < 16) {
      cluster.setupMaster({
        serialization: "advanced",
      });
    } else {
      cluster.setupPrimary({
        serialization: "advanced",
      });
    }

    for (let i = 0; i < cpuLen; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      logger.warn(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    logger.info(`Worker Started`);

    if (io) {
      logger.info(`Running socket on Worker`);
      io.adapter(createAdapter());
      setupWorker(io);
    }

    app.listen(PORT, () => {
      logger.info(`Server is running @ http://127.0.0.1:${PORT}`);
    });
  }
};

export const initialStartMsg = () => {
  console.log(figlet.textSync(`Node.JS . V - ${NODE_VERSION}`));
};
