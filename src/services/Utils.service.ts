import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { convert } from "html-to-text";
import pug from "pug";
import path from "path";

import Role from "../model/role.model";
import Status from "../model/status.model";
import { IRole } from "../utils/interface/role.interface";
import { IStatus } from "../utils/interface/status.interface";
import { forbiddenError, unauthenticatedError } from "./error";
import secret from "../utils/validateEnv";
import User from "../model/user.model";
import { IUser } from "../utils/interface/user.interface";

class UtilsService {
  private operationMap: any = {
    ">": "$gt",
    ">=": "$gte",
    "<": "$lt",
    "<=": "$lte",
    "=": "$eq",
  };

  private regex = /\b(<|>|>=|=|<|>=)\b/g;
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

  authentication: RequestHandler = async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("Bearer")) return next(unauthenticatedError());

      const token = header.split(" ")[1];
      if (!token) return next(unauthenticatedError());

      const decoded: any = await this.verifyToken(token, secret.JWTSIGN);
      if (!decoded) return next(unauthenticatedError());

      const user = await User.findById(decoded.user, "-password -createdAt -updatedAt");
      req.user = user!;
      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * can only be accesssed by admin role
   * @param req
   * @param res
   * @param next
   * @returns
   */
  adminAuthorization: RequestHandler = async (req, res, next) => {
    try {
      const { user } = req;
      const role = await Role.findById(user!.role, "name");
      if (role!.name !== "Admin") return next(forbiddenError());
      return next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * can only be accessed by a doctor
   * @param req
   * @param res
   * @param next
   * @returns
   */
  doctorAuthorization: RequestHandler = async (req, res, next) => {
    try {
      const { user } = req;
      const role = await Role.findById(user!.role, "name");
      if (role!.name === "Doctor" || role?.name === "Admin") return next();
      return next(forbiddenError());
    } catch (error) {
      next(error);
    }
  };

  /**
   * accessible to doctor|nurse and admin
   * @param req
   * @param res
   * @param next
   * @returns
   */
  authorization: RequestHandler = async (req, res, next) => {
    try {
      const { user } = req;
      const role = await Role.findById(user!.role, "name");
      if (role!.name === "Patient") return next(forbiddenError());
      return next();
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param user
   * @param password
   */
  sendWelcomeEmail = async (user: IUser, password: string) => {
    await this.sendEmail("welcome", `Welcome to ${secret.APPLICATION}!`, user, password);
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

  /**
   *
   * @returns nomailer transport
   */
  private createTransport = () => {
    return nodemailer.createTransport({
      host: secret.EMAIL_HOST,
      port: secret.EMAIL_PORT,
      auth: { user: secret.EMAIL_USERNAME, pass: secret.EMAIL_PASSWORD },
    });
  };

  /**
   * send email functionality
   * @param template
   * @param subject
   * @param user
   */
  private sendEmail = async (template: string, subject: string, user: IUser, data: any) => {
    try {
      const html = pug.renderFile(path.join(__dirname, "..", "..", "views", `${template}.pug`), {
        subject,
        user,
        data,
      });
      //email options
      const mailOptions = {
        from: `Daniels <${secret.EMAIL_SENDER}>`,
        to: user.email,
        subject,
        // html,
        text: data, //convert(html),
      };

      //send email
      let tries = 0;
      const maxTries = 5;
      while (tries < maxTries) {
        try {
          await this.createTransport().sendMail(mailOptions);
          console.log("Mail sent successfully");
          break;
        } catch (error) {
          console.log(error);
          tries++;
        }
      }
    } catch (error) {
      console.log(error);
      // return error
    }
  };
}

export default new UtilsService();
