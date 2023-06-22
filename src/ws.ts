import { Socket, Server } from "socket.io";
import server from "./app.js";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected", socket.id);
});

export { server, io };
