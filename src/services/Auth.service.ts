import bcrypt from "bcryptjs";

import { ICreateNewUser, IUser, IUserLogin } from "../utils/interface/user.interface";
import UtilsService from "./Utils.service";
import User from "../model/user.model";
import { notFoundError, unauthenticatedError } from "./error";

class AuthService {
  createUser = async (user: ICreateNewUser) => {
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
  };

  login = async (data: IUserLogin) => {
    const user = await User.findOne({ email: data.email }, "password");
    if (!user) return notFoundError("User/Password");

    const checkPass = this.comparePassword(data.password, user.password);
    if (!checkPass) return unauthenticatedError();

    //gen token
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
}

export default new AuthService();
