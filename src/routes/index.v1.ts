import { Router } from "express";
import { readFile } from "fs/promises";
import path from "path";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";
import fs, { readFileSync } from "fs";

import authRouter from "./auth.routes";

const file = readFileSync(path.join(__dirname, "..", "..", "swagger.yaml"), "utf-8");
const swaggerDocument = YAML.parse(file);

const options = {
  explorer: true,
  customCssUrl: "./swagger.css",
};

const routerv1 = Router();

routerv1.use("/", swaggerUi.serve);
routerv1.get("/", swaggerUi.setup(swaggerDocument, options));
routerv1.use("/auth", authRouter);

export default routerv1;
