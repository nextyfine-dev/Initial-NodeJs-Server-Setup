import { UUIDV4, STRING, UUID } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Room = sequelize.define("Room", {
  id: {
    type: UUID,
    defaultValue: UUIDV4(),
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  roomName: {
    type: STRING,
    allowNull: false,
    unique: true,
    defaultValue: "Global",
  },
});

Room.belongsToMany(User, {
  through: "RoomUser",
  foreignKey: "roomId",
});

User.belongsToMany(Room, {
  through: "RoomUser",
  foreignKey: "userId",
});

export default Room;
