import { RequestHandler } from "express";

import Api from "./Api";
import { ICreateNewUser, IUserLogin } from "../utils/interface/user.interface";
import { validationError } from "../services/error";
import AuthService from "../services/Auth.service";
import AppError from "../utils/AppError";

class Auth extends Api {
  newUser: RequestHandler = async (req, res, next) => {
    try {
      const birthDate = { ...req.body };
      birthDate.dateOfBirth = new Date(birthDate.dateOfBirth);

      const data = await ICreateNewUser.safeParse(birthDate);
      if (!data.success) return next(validationError(data.error));

      const resp = await AuthService.createUser(req.body);
      if (resp instanceof AppError) return next(resp);

      this.sendCreatedResp(res, "Account successfully created", { data: resp });
    } catch (error) {
      next(error);
    }
  };

  login: RequestHandler = async (req, res, next) => {
    try {
      const d = await IUserLogin.safeParse(req.body);
      if (!d.success) return next(validationError(d.error));

      const user = await AuthService.login(req.body);
      if (user instanceof AppError) return next(user);

      this.sendResp(res, "login successful", { user });
    } catch (error) {
      next(error);
    }
  };
}

export default new Auth();
