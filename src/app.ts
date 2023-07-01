import express, { Application } from "express";

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
    //404 error on api
    this.app.use((req, res, next) => {
      res.send(`Ooops.. ${req.originalUrl} not found on this server`);
    });
  }

  private errorHandler() {}
}

export default new App();
