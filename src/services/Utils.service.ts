import jwt from "jsonwebtoken";
import { RequestHandler } from "express";

import Role from "../model/role.model";
import Status from "../model/status.model";
import { IRole } from "../utils/interface/role.interface";
import { IStatus } from "../utils/interface/status.interface";
import { unauthenticatedError } from "./error";
import secret from "../utils/validateEnv";
import User from "../model/user.model";

class UtilsService {
  /**
   *
   * @param el
   * @returns id of the status
   */
  getStatusId = async (el: IStatus) => {
    const status = await Status.findOne({ name: el.name }, "_id");
    return status?.id;
  };

  /**
   *
   * @param el
   * @returns id of the role
   */
  getRoleById = async (el: IRole) => {
    const role = await Role.findOne({ name: el.name }, "_id");
    return role?.id;
  };

  sendEmail = async () => {};

  authentication: RequestHandler = async (req, res, next) => {
    try {
      const payload: any = await this.retrieveToken(req, res, next);
      const user = await User.findById(payload.user, "-password -createdAt -updatedAt");
      req.user = user!;
      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param token token receive from the client
   * @param key secret
   * @returns a valid payload
   */
  private verifyToken = async (token: string, key: string) => {
    return await jwt.verify(token, key);
  };

  /**
   * helper function to get token from header
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private retrieveToken: RequestHandler = async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("Bearer")) return next(unauthenticatedError());

      const token = header.split(" ")[1];
      if (!token) return next(unauthenticatedError());

      const decoded = await this.verifyToken(token, secret.JWTSIGN);
      if (!decoded) return next(unauthenticatedError());

      return decoded;
    } catch (error) {
      next(error);
    }
  };
}

export default new UtilsService();
