import { RequestHandler } from "express";

import Api from "./Api";
import { IMedicatonNewData, IMedicatonUpdateData } from "../utils/interface/medication.interface";
import { validationError } from "../services/error";
import MedicalService from "../services/Med.service";
import AppError from "../utils/AppError";

class MedicalController extends Api {
  medical: RequestHandler = async (req, res, next) => {
    try {
      const {
        params: { medId },
        user,
      } = req;
      const data = await MedicalService.medical(medId, user!.role, user!.id);
      if (data instanceof AppError || data instanceof Error) return next(data);

      this.sendResp(res, "", data);
    } catch (error) {
      next(error);
    }
  };

  medicals: RequestHandler = async (req, res, next) => {
    try {
      const data = await MedicalService.medicals(req);
      if (data instanceof AppError || data instanceof Error) return next(data);

      this.sendResp(res, `Medical eport fetched`, data);
    } catch (error) {
      next(error);
    }
  };

  newMedical: RequestHandler = async (req, res, next) => {
    try {
      const d = IMedicatonNewData.safeParse(req.body);
      if (!d.success) return next(validationError(d.error));

      const { user } = req;
      const data = await MedicalService.newMedical(req.body, user!.id);
      if (data instanceof AppError || data instanceof Error) return next(data);

      this.sendCreatedResp(res, "Medical report has been created", { treatment: data.treatment, medId: data.id });
    } catch (error) {
      next(error);
    }
  };

  updateMedical: RequestHandler = async (req, res, next) => {
    try {
      const d = IMedicatonUpdateData.safeParse(req.body);
      if (!d.success) return next(validationError(d.error));

      const {
        params: { medId },
        user,
      } = req;
      const data = await MedicalService.updateMedical(medId, req.body, user);
      if (data instanceof AppError || data instanceof Error) return next(data);

      this.sendResp(res, "", req.body);
    } catch (error) {
      next(error);
    }
  };
}

export default new MedicalController();
