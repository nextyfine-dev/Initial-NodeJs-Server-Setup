import { UUIDV4, STRING, UUID } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  id: {
    type: UUID,
    defaultValue: UUIDV4(),
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  userName: { type: STRING, allowNull: false, unique: true },
  password: {
    type: STRING,
    allowNull: false,
  },
});

export default User