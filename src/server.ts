import ws from "./ws.js";
import { runTheServer } from "./services/serverService.js";

(async () => {
  const { server, io } = ws();
  await runTheServer(server, io);
})();
