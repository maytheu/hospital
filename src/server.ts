import "dotenv/config";
import { createServer } from "http";

import secret from "./utils/validateEnv";
import App from "./App";
import Db from "./services/Db";

const port = secret.PORT;
const expressApp = App.app;

const server = createServer(expressApp);

const startServer = async () => {
  await Db.connectMongo();
  await Db.syncStatus()
  await Db.syncRole()
  server.listen(port, () => console.log(`Server starting on port ${port}...`));
};

startServer();
