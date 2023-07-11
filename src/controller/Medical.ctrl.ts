import { RequestHandler } from "express";

import Api from "./Api";

class MedicalController extends Api {
  medical: RequestHandler = async (req, res, next) => {
    try {
      this.sendResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };

  medicals: RequestHandler = async (req, res, next) => {
    try {
      this.sendResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };

  newMedical: RequestHandler = async (req, res, next) => {
    try {
      this.sendCreatedResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };

  updateMedical: RequestHandler = async (req, res, next) => {
    try {
      this.sendResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };
}

export default new MedicalController();
