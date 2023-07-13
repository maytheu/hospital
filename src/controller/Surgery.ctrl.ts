import e, { RequestHandler } from "express";

import Api from "./Api";

class SurgeryController extends Api {
  procedure: RequestHandler = async (req, res, next) => {
    try {
      this.sendResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };

  allProcedure: RequestHandler = async (req, res, next) => {
    try {
      this.sendResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };

  newProcedure: RequestHandler = async (req, res, next) => {
    try {
      this.sendCreatedResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };

  updateProcedure: RequestHandler = async (req, res, next) => {
    try {
      this.sendResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };

  deleterocedure: RequestHandler = async (req, res, next) => {
    try {
      this.sendDelResp(res, "");
    } catch (error) {
      next(error);
    }
  };
}
export default new SurgeryController();
