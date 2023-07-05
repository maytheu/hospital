import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";

import { ICreateNewUser, IUser, IUserLogin } from "../utils/interface/user.interface";
import UtilsService from "./Utils.service";
import User from "../model/user.model";
import { notFoundError, unauthenticatedError } from "./error";
import secret from "../utils/validateEnv";

class AuthService {
  createUser = async (user: ICreateNewUser) => {
    try {
      //generate random password
      const password = this.genPass();
      //encrpy password
      const hash = await this.encryptPassword(password);

      //fetch status and role id
      const [status, role] = await Promise.all([
        UtilsService.getStatusId({ name: "Active" }),
        UtilsService.getRoleById({ name: user.role }),
      ]);
      //save
      const createUser: IUser = { ...user, password: hash, status, role: role };
      await User.create(createUser);
      //send to email
      console.log(password);

      return `Please check your email(${user.email}) to copy credentials`;
    } catch (error) {
      return error;
    }
  };

  login = async (data: IUserLogin) => {
    try {
      const user = await User.findOne({ email: data.email }, "password id role");
      console.log(user);

      if (!user) return unauthenticatedError();

      const checkPass = this.comparePassword(data.password, user.password);
      if (!checkPass) return unauthenticatedError();

      //gen token
      const payload = { user: user.id, role: user.role };
      const token = this.genToken(payload, secret.JWTSIGN);

      return token;
    } catch (error) {
      return error;
    }
  };

  /**
   *
   * @param password user input password
   * @param hash saved password in db
   * @returns
   */
  comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  };

  /**
   * generate password for new user
   */
  private genPass(): string {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const symbols = "!@#$%^&*()_";
    const number = "1234567890";

    let generatedPassword = "";
    const validChars = letters + symbols + number;
    for (let i = 0; i < 15; i++) {
      const ind = Math.floor(Math.random() * validChars.length);
      generatedPassword += validChars[ind];
    }
    return generatedPassword;
  }

  /**
   *
   * @param password encrpt password
   * @returns hased password
   */
  private encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };

  /**
   *
   * @param data payload
   * @param key secret
   * @param time expiration time
   * @returns signed token
   */
  private genToken = async (data: object, key: string, time: string = "10d") => {
    return await jwt.sign(data, key, { expiresIn: time });
  };
}

export default new AuthService();
