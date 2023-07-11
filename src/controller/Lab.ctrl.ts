import { RequestHandler } from "express";

import Api from "./Api";
import LabService from "../services/Lab.service";
import { ILaboratoryData, ILaboratoryNewData, ILaboratoryUpdateData } from "../utils/interface/laboratory.interface";
import { validationError } from "../services/error";
import AppError from "../utils/AppError";

class Laboratory extends Api {
  allResult: RequestHandler = async (req, res, next) => {
    try {
      const { user } = req;
      const data = await LabService.allResult(req, user);
      if (data instanceof Error) return next(data);

      this.sendResp(res, `${data.count} result(s) available`, {
        results: data.data,
        count: data.count,
        page: data.page,
      });
    } catch (error) {
      next(error);
    }
  };

  lab: RequestHandler = async (req, res, next) => {
    try {
      const { params: {labId}, user } = req;      

      const data = await LabService.lab(labId, user!.role, user!.id);
      if (data instanceof Error) return next(data);

      this.sendResp(res, "", { result: data });
    } catch (error) {
      next(error);
    }
  };

  newLab: RequestHandler = async (req, res, next) => {
    try {
      const d = ILaboratoryNewData.safeParse(req.body);
      if (!d.success) return next(validationError(d.error));

      const { user } = req;
      const data = await LabService.newlab(req.body, user!.id);
      if (data instanceof AppError || data instanceof Error) return next(data);

      this.sendCreatedResp(res, "Lab data created", { name: data.name, id: data.id });
    } catch (error) {
      next(error);
    }
  };

  update: RequestHandler = async (req, res, next) => {
    try {
      const d = ILaboratoryUpdateData.safeParse(req.body);
      if (!d.success) return next(validationError(d.error));

      const { params: {labId}, user } = req;      
      const data = await LabService.updateLab(req.body, labId, user);
      if (data instanceof AppError || data instanceof Error) return next(data);

      this.sendResp(res, "Lab result updated", req.body);
    } catch (error) {
      next(error);
    }
  };
}

export default new Laboratory();
