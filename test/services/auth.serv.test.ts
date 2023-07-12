import dotenv from "dotenv";
import request from "supertest";

dotenv.config({ path: ".test.env" });

import Db from "../../src/services/Db";
import UtilsService from "../../src/services/Utils.service";
import AuthService from "../../src/services/Auth.service";
import secret from "../../src/utils/validateEnv";
import { ICreateNewUser } from "../../src/utils/interface/user.interface";

import App from "../../src/App";
import { IMedicatonNewData } from "../../src/utils/interface/medication.interface";

const app = App.app;
const appRequest = request(app);
const authUrl = "/hospital/api/v1/auth";

describe("Unit test for auth service", () => {
  let tokenAdmin: string;
  let tokenDoc: string;
  let tokenPat: string;
  let tokenNur: string;
  let passwordAdmin: string;
  let passwordDoc: string;
  let passwordNur: string;
  let passwordPat: string;
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
    const tokenAdmin = await AuthService["genToken"](payload, secret.JWTSIGN);
    const decoded = await UtilsService["verifyToken"](tokenAdmin, secret.JWTSIGN);
    expect(decoded).toMatchObject(payload);
  });

  describe("should test auth flow", () => {
    const userAdmin: ICreateNewUser = {
      fullname: "patient one",
      email: "test@adetunjim.com",
      dateOfBirth: new Date("2001-06-06"),
      phone: "+23410121389781",
      role: "Admin",
    };

    const userDoc: ICreateNewUser = {
      fullname: "Doctor one",
      email: "testdoc@adetunjim.com",
      dateOfBirth: new Date("2001-06-06"),
      phone: "+23410121389781",
      role: "Doctor",
    };

    const newUser: ICreateNewUser = {
      fullname: "test ok",
      dateOfBirth: new Date("2004-11-12"),
      role: "Patient",
      email: "me@adetunjim.com",
      phone: "+123454231526",
    };

    const nurseUser: ICreateNewUser = {
      fullname: "test nurse",
      dateOfBirth: new Date("2004-11-12"),
      role: "Nurse",
      email: "nurse@adetunjim.com",
      phone: "+123454231524",
    };

    beforeAll(async () => {
      const data = await AuthService.createUser(userAdmin);
      const dataDoc = await AuthService.createUser(userDoc);
      const dataPat = await AuthService.createUser(newUser);
      const dataNur = await AuthService.createUser(nurseUser);
      passwordAdmin = data.password;
      passwordDoc = dataDoc.password;
      passwordPat = dataPat.password;
      passwordNur = dataNur.password;
    });

    it("Should return token", async () => {
      tokenAdmin = await AuthService.login({ email: userAdmin.email, password: passwordAdmin });
      expect(tokenAdmin.split(".").length).toBe(3);
    });

    it("should not login ", async () => {
      expect(await AuthService.login({ email: "user@email.com", password: passwordAdmin })).toMatchObject({
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

    it("Should return 200 reponse for doctor login and token", async () => {
      const resp = await appRequest
        .post(`${authUrl}/login`)
        .send({ email: "testdoc@adetunjim.com", password: passwordDoc })
        .expect(200);
      tokenDoc = resp.body.data.token;
      expect(tokenDoc.split(".").length).toBe(3);
    });

    it("Should return 403 since only admin can create new account", async () => {
      await appRequest.post(`${authUrl}/new`).set("Authorization", `Bearer ${tokenDoc}`).send(newUser).expect(403);
    });

    it("Should not create patient since patient is already created", async () => {
      await appRequest.post(`${authUrl}/new`).set("Authorization", `Bearer ${tokenAdmin}`).send(newUser).expect(500);
    });

    it("Should return 422 reponse", async () => {
      await appRequest.post(`${authUrl}/login`).send({ email: "test@mato", password: "!Pass123" }).expect(422);
    });

    it("Should return 401 reponse since user not logged in", async () => {
      await appRequest.post(`${authUrl}/login`).send({ email: "test@mato.com", password: "!Pass123" }).expect(401);
    });

    it("should return user profile with 200", async () => {
      await appRequest.get(`${authUrl}/me`).set("Authorization", `Bearer ${tokenAdmin}`).expect(200);
    });

    it("Should return 200 reponse for patient login and token", async () => {
      const resp = await appRequest
        .post(`${authUrl}/login`)
        .send({ email: "me@adetunjim.com", password: passwordPat })
        .expect(200);
      tokenPat = resp.body.data.token;
      expect(tokenPat.split(".").length).toBe(3);
    });

    it("should update to new password with 200", async () => {
      await appRequest
        .put(`${authUrl}/update-password`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ oldPassword: passwordAdmin, newPassword: "@Pass123" })
        .expect(200);
    });

    it("should return 422 for bad password format", async () => {
      await appRequest
        .put(`${authUrl}/update-password`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ oldPassword: passwordAdmin, newPassword: "@12345t" })
        .expect(422);
    });

    it("should not update with wrong password and return 403", async () => {
      await appRequest
        .put(`${authUrl}/update-password`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ oldPassword: passwordAdmin, newPassword: "@Pass123" })
        .expect(403);
    });

    it("Should update user profile with 200", async () => {
      await appRequest
        .put(`${authUrl}/update-profile`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ phone: "+123456789876", address: "updated address" })
        .expect(200);
    });

    it("Should return 422 since email and password cannot be updated", async () => {
      await appRequest
        .put(`${authUrl}/update-profile`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ email: "me@mato.com", password: "updated address" })
        .expect(422);
    });

    it("Should return 200 reponse for nunrse login and token", async () => {
      const resp = await appRequest
        .post(`${authUrl}/login`)
        .send({ email: "nurse@adetunjim.com", password: passwordNur })
        .expect(200);
      tokenNur = resp.body.data.token;
      expect(tokenNur.split(".").length).toBe(3);
    });
  });

  describe("handle lab routes", () => {
    const labUrl = "/hospital/api/v1/lab";
    let labId: string;
    const newLab = { name: "DNA test", description: "", email: "me@adetunjim.com" };
    const newLabError = { name: "DNA test", description: "", email: "meto@adetunjim.com" };

    it("Should return 404 when user with incorrect email", async () => {
      await appRequest.post(`${labUrl}/new`).set("Authorization", `Bearer ${tokenDoc}`).send(newLabError).expect(404);
    });

    it("Should return forbidden since patient cannot create lab", async () => {
      await appRequest.post(`${labUrl}/new`).set("Authorization", `Bearer ${tokenPat}`).send(newLab).expect(403);
    });

    it("should create new lab", async () => {
      const resp = await appRequest
        .post(`${labUrl}/new`)
        .set("Authorization", `Bearer ${tokenDoc}`)
        .send(newLab)
        .expect(201);
      labId = resp.body.data.id;
    });

    it("Should only return data for authorized user", async () => {
      await appRequest.get(`${labUrl}/${labId}`).set("Authorization", `Bearer ${tokenPat}`).expect(200);
    });

    it("Should be forbidden sice nurse cannt access patient lab", async () => {
      await appRequest.get(`${labUrl}/${labId}`).set("Authorization", `Bearer ${tokenNur}`).expect(403);
    });

    it("Should return all lab", async () => {
      const resp = await appRequest.get(`${labUrl}`).set("Authorization", `Bearer ${tokenPat}`).expect(200);
      expect(resp.body.data.count).toBe(1);
    });

    it("Should not return data for nurse", async () => {
      const resp = await appRequest.get(`${labUrl}`).set("Authorization", `Bearer ${tokenNur}`).expect(200);
      expect(resp.body.data.count).toBe(0);
    });

    it("Should be return patint result to doctor or admin", async () => {
      await appRequest.get(`${labUrl}/${labId}`).set("Authorization", `Bearer ${tokenDoc}`).expect(200);
    });

    it("Should update lab with result", async () => {
      await appRequest
        .put(`${labUrl}/update/${labId}`)
        .set("Authorization", `Bearer ${tokenDoc}`)
        .send({ result: "AA" })
        .expect(200);
    });

    it("Should return 404 since only the user that create can update", async () => {
      await appRequest
        .put(`${labUrl}/update/${labId}`)
        .set("Authorization", `Bearer ${tokenNur}`)
        .send({ result: "AA" })
        .expect(404);
    });

    it("Should update lab since its an admin", async () => {
      await appRequest
        .put(`${labUrl}/update/${labId}`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ result: "AB" })
        .expect(200);
    });

    it("Should return 404 for invalid labid", async () => {
      await appRequest
        .put(`${labUrl}/update/invalid`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ result: "AB" })
        .expect(404);
    });
  });

  describe("Should handle medical request", () => {
    let medId: string;
    let medNurId: string;
    const medUrl = "/hospital/api/v1/medical";
    const medData: IMedicatonNewData = {
      treatment: "what",
      drugsAndDosage: "2/day",
      duration: "1",
      frequency: "2",
      email: "me@adetunjim.com",
    };
    const medDataE = {
      treatment: "what",
      drugsAndDosage: "2/day",
      duration: "1",
      frequency: "2",
    };
    const medDataEmail: IMedicatonNewData = {
      treatment: "what",
      drugsAndDosage: "2/day",
      duration: "1",
      frequency: "2",
      email: "err@adetunjim.com",
    };
    const medDataNu: IMedicatonNewData = {
      treatment: "what nurse",
      drugsAndDosage: "2/day",
      duration: "1",
      frequency: "2",
      email: "nurse@adetunjim.com",
    };
    it("Should return 401 since not token is passed", async () => {
      await appRequest.get(medUrl).expect(401);
    });

    it("Should return 422 for bad data", async () => {
      await appRequest.post(`${medUrl}/new`).set("Authorization", `Bearer ${tokenAdmin}`).send(medDataE).expect(422);
    });

    it("should return 404 for invalid patient", async () => {
      await appRequest.post(`${medUrl}/new`).set("Authorization", `Bearer ${tokenDoc}`).send(medDataEmail).expect(404);
    });

    it("should create new medical report", async () => {
      const resp = await appRequest
        .post(`${medUrl}/new`)
        .set("Authorization", `Bearer ${tokenDoc}`)
        .send(medData)
        .expect(201);
      medId = resp.body.data.medId;
    });

    it("should create new medical report for nurse", async () => {
      const resp = await appRequest
        .post(`${medUrl}/new`)
        .set("Authorization", `Bearer ${tokenNur}`)
        .send(medDataNu)
        .expect(201);
      medNurId = resp.body.data.medId;
    });

    it("should return 404, since its invallid id", async () => {
      await appRequest.get(`${medUrl}/invalid`).set("Authorization", `Bearer ${tokenPat}`).expect(404);
    });

    it("should restrict from nurse with no eentry", async () => {
      const resp = await appRequest.get(`${medUrl}/${medId}`).set("Authorization", `Bearer ${tokenNur}`).expect(200);
      expect(resp.body.data).toBeNull();
    });

    it("should return data for nurse, since its nurse that is the patient", async () => {
      const resp = await appRequest.get(`${medUrl}/${medNurId}`).set("Authorization", `Bearer ${tokenNur}`).expect(200);
      expect(resp.body.data.treatment).toBe(medDataNu.treatment);
    });

    it("Should return all medical report", async () => {
      const resp = await appRequest.get(medUrl).set("Authorization", `Bearer ${tokenAdmin}`).expect(200);
      expect(resp.body.data.count).toBe(2);
    });

    it("Should return all patient medical report", async () => {
      const resp = await appRequest.get(medUrl).set("Authorization", `Bearer ${tokenPat}`).expect(200);
      expect(resp.body.data.count).toBe(1);
    });

    it("should be only be updated by the user that create", async () => {
      const resp = await appRequest
        .put(`${medUrl}/update/${medNurId}`)
        .set("Authorization", `Bearer ${tokenNur}`)
        .send({ frequency: "3" })
        .expect(200);
      expect(resp.body.data.frequency).toBe("3");
    });

    it("doctor and admin should be able to update report created by nurse", async () => {
      const resp = await appRequest
        .put(`${medUrl}/update/${medNurId}`)
        .set("Authorization", `Bearer ${tokenDoc}`)
        .send({ duration: "3" })
        .expect(200);
      expect(resp.body.data.duration).toBe("3");
    });

    it("should not be able to update report created by doctor", async () => {
      await appRequest
        .put(`${medUrl}/update/${medId}`)
        .set("Authorization", `Bearer ${tokenNur}`)
        .send({ duration: "3" })
        .expect(403);
    });
  });
});
