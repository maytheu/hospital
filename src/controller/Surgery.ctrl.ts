import e, { RequestHandler } from "express";

import Api from "./Api";
import { ISurgeryData, ISurgeryUpdateData } from "../utils/interface/surgery.interface";
import { validationError } from "../services/error";
import SurgeryService from "../services/Surgery.service";
import AppError from "../utils/AppError";

class SurgeryController extends Api {
  procedure: RequestHandler = async (req, res, next) => {
    try {
      const {
        params: { surgeryId },
        user,
      } = req;

      const data = await SurgeryService.procedure(surgeryId, user?.role, user?.id);
      if (data instanceof Error || data instanceof AppError) return next(data);

      this.sendResp(res, "", data);
    } catch (error) {
      next(error);
    }
  };

  allProcedure: RequestHandler = async (req, res, next) => {
    try {
      const data = await SurgeryService.allProcedure(req);
      if (data instanceof Error || data instanceof AppError) return next(data);

      this.sendResp(res, "", data);
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
      if (data instanceof Error || data instanceof AppError) return next(data);

      this.sendCreatedResp(res, "Procedure recorded", data);
    } catch (error) {
      next(error);
    }
  };

  updateProcedure: RequestHandler = async (req, res, next) => {
    try {
      const d = ISurgeryUpdateData.safeParse(req.body);
      if (!d.success) return next(validationError(d.error));

      const { surgeryId } = req.params;

      const data = await SurgeryService.updateProcedure(req.body, surgeryId);
      if (data instanceof Error || data instanceof AppError) return next(data);
      this.sendResp(res, "Procedure updated", data);
    } catch (error) {
      next(error);
    }
  };

  deleteProcedure: RequestHandler = async (req, res, next) => {
    try {
      const { surgeryId } = req.params;
      const data = await SurgeryService.deleteProcedure(surgeryId);
      if (data instanceof Error || data instanceof AppError) return next(data);

      this.sendDelResp(res, "");
    } catch (error) {
      next(error);
    }
  };
}
export default new SurgeryController();
