import "dotenv/config";
import { createServer } from "http";
import secret from "./utils/validateEnv";
import App from "./app";

const port = secret.PORT;
const expressApp = App.app;

const server = createServer(expressApp);

const startServer = async () => {
  server.listen(port, () => console.log(`Server starting on port ${port}...`));
};

startServer();
