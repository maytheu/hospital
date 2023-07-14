import e, { RequestHandler } from "express";

import Api from "./Api";
import { ISurgeryData } from "../utils/interface/surgery.interface";
import { validationError } from "../services/error";
import SurgeryService from "../services/Surgery.service";
import AppError from "../utils/AppError";

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
      const d = ISurgeryData.safeParse(req.body);      
      if (!d.success) return next(validationError(d.error));

      const { user } = req;

      const data = await SurgeryService.newProcedure(req.body, user?.id);
      if(data instanceof Error|| data instanceof AppError)return next(data)
     
      this.sendCreatedResp(res, "Procedure recorded", data);
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
