import { RequestHandler } from "express";

import Api from "./Api";
import { ICreateNewUser } from "../utils/interface/user.interface";
import { validationError } from "../services/error";

class Auth extends Api {
  newUser: RequestHandler = async (req, res, next) => {
    try {
      const { success } = await ICreateNewUser.safeParse(req.body);
      if (!success) return next(validationError());
      this.sendResp(res, "", {});
    } catch (error) {
      next(error);
    }
  };
}

export default new Auth();
