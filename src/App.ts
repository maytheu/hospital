import express, { Application } from "express";

import AppError from "./utils/AppError";
import { errorHandler } from "./services/error";
import routerv1 from "./routes/index.v1";

class App {
  app: Application;

  constructor() {
    this.app = express();

    this.middleware();
    this.route();
    this.errorHandler();
  }

  private middleware() {
    this.app.use(express.json());
  }

  private route() {
    //local dev
    this.app.use("/local/api/v1", routerv1);

    this.app.use("/hospital/api/v1", routerv1);

    //404 error on api
    this.app.use((req, res, next) => {
      next(new AppError(`Ooops.. ${req.originalUrl} not found on this server`, 404));
    });
  }

  private errorHandler() {
    this.app.use(errorHandler);
  }
}

export default new App();
