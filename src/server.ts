import { server, io } from "./ws.js";
import { runOnThread } from "./services/serverService.js";
import sequelize from "./config/database.js";
import logger from "./logs/logger.js";

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // { force: true }

    runOnThread(server, io);

    logger.info("Db connected successfully!");
  } catch (error) {
    logger.error(`Db connection error -> ${error}`);
  }
})();
