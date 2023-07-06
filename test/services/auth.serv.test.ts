import dotenv from "dotenv";

dotenv.config({ path: ".test.env" });

import AuthService from "../../src/services/Auth.service";
import UtilsService from "../../src/services/Utils.service";
import secret from "../../src/utils/validateEnv";
import Db from "../../src/services/Db";
import { ICreateNewUser } from "../../src/utils/interface/user.interface";

describe("Unit test for auth service", () => {
  it("should return string of length 15", () => {
    expect(AuthService["genPass"]().length).toBe(15);
  });

  it("Should encrypt and decrypt password", async () => {
    const password = AuthService["genPass"]();
    const hash = await AuthService["encryptPassword"](password);
    expect(await AuthService["comparePassword"](password, hash)).toBe(true);
  });

  it("Should return false for incorrect password", async () => {
    const password = AuthService["genPass"]();
    const hash = await AuthService["encryptPassword"](password);
    const password2 = AuthService["genPass"]();
    expect(await AuthService["comparePassword"](password2, hash)).toBe(false);
  });

  it("should return token", async () => {
    expect(await AuthService["genToken"]({}, secret.JWTSIGN)).toBeTruthy();
  });

  it("Should return the same payload", async () => {
    const payload = { el: "test payload" };
    const token = await AuthService["genToken"](payload, secret.JWTSIGN);
    const decoded = await UtilsService["verifyToken"](token, secret.JWTSIGN);
    expect(decoded).toMatchObject(payload);
  });

  describe("should test auth flow", () => {
    const user: ICreateNewUser = {
      fullname: "patient one",
      email: "test@adetunjim.com",
      dateOfBirth: new Date("2001-06-06"),
      phone: "+23410121389781",
      role: "Admin",
    };
    let password: string;
    beforeAll(async () => {
      await Db.connectMongo();
      // await Db.syncStatus();
      // await Db.syncRole();

      const data = await AuthService.createUser(user);
      password = data.password;
    });

    // afterAll(async () => {
    //   Db.disconnectMongo();
    //   Db.dropMongoDb();
    // });

    it("Should login", async () => {
      expect(await AuthService.login({ email: user.email, password })).toBeTruthy();
    });

    // it("should not login ", async () => {
    //   expect(await AuthService.login({ email: "user@email.com", password })).toMatchObject({
    //     message: "user/password not found",
    //   });
    // });
  });
});
