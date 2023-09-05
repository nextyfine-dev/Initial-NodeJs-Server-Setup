import { Server as HttpServer } from "node:http";
import { Socket, Server } from "socket.io";
import server from "./app.js";

const ws = () => {
  if (!(server instanceof HttpServer)) return { server, io: null };
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("a user connected", socket.id);
  });

  return { server, io };
};

export default ws;
