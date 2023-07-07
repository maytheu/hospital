import dotenv from "dotenv";
import request from "supertest";

dotenv.config({ path: ".test.env" });

import Db from "../../src/services/Db";
import UtilsService from "../../src/services/Utils.service";
import AuthService from "../../src/services/Auth.service";
import secret from "../../src/utils/validateEnv";
import { ICreateNewUser } from "../../src/utils/interface/user.interface";

import App from "../../src/App";

const app = App.app;
const appRequest = request(app);
const authUrl = "/hospital/api/v1/auth";

describe("Unit test for auth service", () => {
  let token;
  beforeAll(async () => {
    await Db.connectMongo();
    await Db.syncRole();
    await Db.syncStatus();
  });

  afterAll(async () => {
    await Db.dropMongoDb();
    await Db.disconnectMongo();
  });

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
      const data = await AuthService.createUser(user);
      password = data.password;
    });

    it("Should return token", async () => {
      token = await AuthService.login({ email: user.email, password });
      expect(token.split(".").length).toBe(3);
    });

    it("should not login ", async () => {
      expect(await AuthService.login({ email: "user@email.com", password })).toMatchObject({
        message: "user/password not found",
      });
    });
  });

  describe("Should test util component", () => {
    it("Should return an id from status", async () => {
      const sts = await UtilsService.getStatusId({ name: "Active" });
      expect(sts).toBeTruthy();
    });

    it("Should return an id from role", async () => {
      const sts = await UtilsService.getRoleById({ name: "Doctor" });
      expect(sts).toBeTruthy();
    });
  });

  describe("Should handle auth route", () => {
    const newUserwithErr = { fullname: "test error", dateOfBirth: "2004-11-12", role: "Admin", email: "me@.com" };
    const newUser = {
      fullname: "test ok",
      dateOfBirth: "2004-11-12",
      role: "Patient",
      email: "me@adetunjim.com",
      phone: "+123454231526",
    };

    it("Should return 401 reponse since since only admin can create new", async () => {
      await appRequest.post(`${authUrl}/new`).send(newUser).expect(401);
    });

    it("Should return 422 reponse", async () => {
      await appRequest.post(`${authUrl}/login`).send({ email: "test@mato", password: "!Pass123" }).expect(422);
    });

    it("Should return 401 reponse since user not logged in", async () => {
      await appRequest.post(`${authUrl}/login`).send({ email: "test@mato.com", password: "!Pass123" }).expect(401);
    });

    // it('should looad user profile',()=>{

    // })
  });
});
