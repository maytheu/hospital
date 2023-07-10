import { RequestHandler } from "express";

import Api from "./Api";

class Laboratory extends Api {
  allResult: RequestHandler = async (req, res, next) => {
    try {
      this.sendResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };

  lab: RequestHandler = async (req, res, next) => {
    try {
      this.sendResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };

  newLab: RequestHandler = async (req, res, next) => {
    try {
      this.sendCreatedResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };

  update: RequestHandler = async (req, res, next) => {
    try {
      this.sendResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };
}

export default new Laboratory();
