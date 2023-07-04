import { RequestHandler } from "express";

import Api from "./Api";
import { ICreateNewUser } from "../utils/interface/user.interface";

class Auth extends Api {
  newUser: RequestHandler = async (req, res, next) => {
    try {
        const val = await ICreateNewUser.safeParse(req.body)
        this.sendResp(res, '', val)
    } catch (error) {
      next(error);
    }
  };
}

export default new Auth();
