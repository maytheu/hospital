import { RequestHandler } from "express";

import Api from "./Api";
import { ICreateNewUser, IPasswordChange, IUpdateProfile, IUserLogin } from "../utils/interface/user.interface";
import { validationError } from "../services/error";
import AuthService from "../services/Auth.service";
import AppError from "../utils/AppError";
import Lab from "../model/laboratory.model";
import Progress from "../model/progress.model";
import Medication from "../model/medication.model";
import Surgery from "../model/surgery.model";
import User from "../model/user.model";

class Auth extends Api {
  newUser: RequestHandler = async (req, res, next) => {
    try {
      const birthDate = { ...req.body };
      birthDate.dateOfBirth = new Date(birthDate.dateOfBirth);

      const data = await ICreateNewUser.safeParse(birthDate);
      if (!data.success) return next(validationError(data.error));

      const resp = await AuthService.createUser(req.body);
      if (resp.data instanceof Error || resp instanceof AppError) return next(resp);

      this.sendCreatedResp(res, "Account successfully created", { data: resp.data });
    } catch (error) {
      next(error);
    }
  };

  login: RequestHandler = async (req, res, next) => {
    try {
      const d = await IUserLogin.safeParse(req.body);
      if (!d.success) return next(validationError(d.error));

      const token = await AuthService.login(req.body);
      if (token instanceof AppError || token instanceof Error) return next(token);

      this.sendResp(res, "login successful", token);
    } catch (error) {
      next(error);
    }
  };

  profile: RequestHandler = async (req, res, next) => {
    try {
      const { user } = req;
      const projection = "-patient -_id";
      const laboratory = await Lab.find({ patient: user!.id }, projection);
      const report = await Progress.find({ patient: user!.id }, projection);
      const medication = await Medication.find({ patient: user!.id }, projection);
      const surgery = await Surgery.find({ patient: user!.id }, projection);
      this.sendResp(res, "", { user, laboratory, report, medication, surgery });
    } catch (error) {
      next(error);
    }
  };

  updatePassword: RequestHandler = async (req, res, next) => {
    try {
      const d = IPasswordChange.safeParse(req.body);
      if (!d.success) return next(validationError(d.error));

      const { user } = req;
      const data = await AuthService.updatePassword(req.body, user!.id);
      if (data instanceof AppError || data instanceof Error) return next(data);

      this.sendResp(res, "Password changed", {});
    } catch (error) {
      next(error);
    }
  };

  updateProfile: RequestHandler = async (req, res, next) => {
    try {
      const d = IUpdateProfile.safeParse(req.body);
      if (!d.success) return next(validationError(d.error));

      const data = req.body;
      const { user } = req;
      await User.findByIdAndUpdate(user!.id, data);

      this.sendResp(res, "Profile updated", {});
    } catch (error) {
      next(error);
    }
  };
}

export default new Auth();
