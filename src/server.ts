import "dotenv/config";
import { createServer } from "http";

import secret from "./utils/validateEnv";
import App from "./app";
import Db from "./services/db";

const port = secret.PORT;
const expressApp = App.app;

const server = createServer(expressApp);

const startServer = async () => {
  await Db.connectMongo();
  await Db.syncStatus()
  server.listen(port, () => console.log(`Server starting on port ${port}...`));
};

startServer();
