import "dotenv/config";
import { createServer } from "http";
import secret from "./utils/validateEnv";

const port = secret.PORT;

const server = createServer();

const startServer = async () => {
  server.listen(port, () => console.log(`Server starting on port ${port}...`));
};

startServer();
