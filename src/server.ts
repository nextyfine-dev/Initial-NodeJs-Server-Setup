import { server, io } from "./ws.js";
import { runOnThread } from "./services/serverService.js";

runOnThread(server, io);
