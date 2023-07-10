import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { ICreateNewUser, IPasswordChange, IUpdateProfile, IUser, IUserLogin } from "../utils/interface/user.interface";
import UtilsService from "./Utils.service";
import User from "../model/user.model";
import { forbiddenError, notFoundError, unauthenticatedError } from "./error";
import secret from "../utils/validateEnv";

class AuthService {
  createUser = async (user: ICreateNewUser): Promise<{ data: any; password: string }> => {
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
      await UtilsService.sendWelcomeEmail(createUser, password);

      return { data: `Please check your email(${user.email}) to copy credentials`, password };
    } catch (error) {
      return { data: error, password: "" };
    }
  };

  login = async (data: IUserLogin): Promise<any> => {
    try {
      const user = await User.findOne({ email: data.email }, "password id role");
      if (!user) return unauthenticatedError();

      const checkPass = await this.comparePassword(data.password, user.password);
      if (!checkPass) return unauthenticatedError();

      //gen token
      const payload = { user: user.id, role: user.role };
      const token = await this.genToken(payload, secret.JWTSIGN);

      return token;
    } catch (error) {
      return error;
    }
  };

  updatePassword = async (password: IPasswordChange, id: string) => {
    try {
      const user = await User.findById(id, "password");
      if (!user) return notFoundError("Entity");

      const checkPass = await this.comparePassword(password.oldPassword, user.password);
      if (!checkPass) return forbiddenError();

      const hash = await this.encryptPassword(password.newPassword);
      await User.findByIdAndUpdate(id, { password: hash });
      return;
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
   * generate jwt
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
