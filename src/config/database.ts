import { Sequelize } from "sequelize";
import { dbConfig } from "./index.js";

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    ...dbConfig.options,
  }
);

export default sequelize;
