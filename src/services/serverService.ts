import cluster from "node:cluster";
import {
  IncomingMessage,
  Server as HttpServer,
  ServerResponse,
} from "node:http";
import os from "node:os";
import v8 from "node:v8";
import { Response, Express } from "express";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events.js";
import { setupMaster, setupWorker } from "@socket.io/sticky";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
import figlet from "figlet";

import { NODE_VERSION, PORT } from "../config/index.js";
import { cpuLen } from "../config/constants.js";
import logger from "../logs/logger.js";
import sequelize from "../config/database.js";

export const sendSuccessRes = (
  res: Response,
  message: string,
  data?: any,
  statusCode: StatusCodes = StatusCodes.OK
) =>
  res.status(statusCode).json({
    status: "success",
    statusCode,
    message,
    data,
  });

export const checkMemoryAndRestart = () => {
  const memoryUsage = process.memoryUsage();
  const totalMemory = os.totalmem();
  const memoryUsagePercentage = (memoryUsage.rss / totalMemory) * 100;

  logger.info(`Memory usage: ${memoryUsagePercentage.toFixed(2)}%`);

  const memoryThreshold = 90;

  if (memoryUsagePercentage >= memoryThreshold) {
    logger.warn("Memory usage exceeded the threshold. Restarting server...");

    process.exit(1);
  }
};

export const checkHeapUsageAndRestart = () => {
  const heapStatistics = v8.getHeapStatistics();
  const totalHeapSize = heapStatistics.total_heap_size;
  const usedHeapSize = heapStatistics.used_heap_size;
  const heapUsagePercentage = (usedHeapSize / totalHeapSize) * 100;

  logger.info(`Heap usage: ${heapUsagePercentage.toFixed(2)}%`);

  if (heapUsagePercentage >= 97) {
    logger.info("Heap usage exceeded the threshold. Restarting server...");
    process.exit(1);
  }
};

// export const runServerOnThreads = (
//   app: Express | HttpServer<typeof IncomingMessage, typeof ServerResponse>
// ) => {
//   if (cluster.isPrimary) {
//     initialStartMsg();
//     logger.info(`Primary is running`);
//     cluster.setupPrimary({
//       serialization: "advanced",
//     });

//     for (let i = 0; i < cpuLen; i++) {
//       cluster.fork();
//     }

//     cluster.on("exit", (worker) => {
//       logger.warn(`worker ${worker.process.pid} died`);
//       cluster.fork();
//     });
//   } else {
//     logger.info(`Worker Started`);
//     runTheServer(app);
//   }
// };

export const runTheMainServer = (
  app: Express | HttpServer<typeof IncomingMessage, typeof ServerResponse>
) => {
  const server = app.listen(PORT, () => {
    logger.info(`Server is running @ http://127.0.0.1:${PORT}`);
  });

  const handleExit = () => {
    console.warn(
      `Process ${process.pid} is exiting. Closing server gracefully...`
    );
    server.close(() => {
      console.log(`Server in process ${process.pid} has been closed.`);
      process.exit(0);
    });
  };

  process.on("SIGINT", handleExit);
  process.on("SIGTERM", handleExit);

  setInterval(() => {
    checkMemoryAndRestart();
    checkHeapUsageAndRestart();
  }, 60000);
};

export const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // { force: true }

    logger.info("Db connected successfully!");
  } catch (error) {
    logger.error(`Db connection error -> ${error}`);
  }
};

export const runTheServer = async (
  app: Express | HttpServer<typeof IncomingMessage, typeof ServerResponse>,
  io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null,
  runOnThreads: boolean = true,
  hasDbConnection: boolean = false
) => {
  try {
    if (runOnThreads) {
      runOnServerOnThreads(app, io);
    } else {
      runTheMainServer(app);
    }
    if (hasDbConnection) {
      await connectToDb();
    }
  } catch (error) {
    logger.error(`Something Went Wrong in the server -> ${error}`);
  }
};

export const runOnServerOnThreads = (
  app: Express | HttpServer<typeof IncomingMessage, typeof ServerResponse>,
  io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null
) => {
  if (cluster.isPrimary) {
    initialStartMsg();
    logger.info(`Primary is running`);

    if (io && app instanceof HttpServer) {
      logger.info(`Running socket on Primary`);

      setupMaster(app, {
        loadBalancingMethod: "least-connection",
      });

      setupPrimary();
    }

    cluster.setupPrimary({
      serialization: "advanced",
    });

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
    runTheMainServer(app);
  }
};

export const initialStartMsg = () => {
  console.log(figlet.textSync(`Node.JS . V - ${NODE_VERSION}`));
};
