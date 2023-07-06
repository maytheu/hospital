import dotenv from "dotenv";
import request from "supertest";

dotenv.config({ path: ".test.env" });

import App from "../../src/App";
import Db from "../../src/services/Db";

const app = App.app;
const appRequest = request(app);
const authUrl = "/hospital/api/v1/auth";

describe("Should handle auth route", () => {
  beforeAll(async () => {
    await Db.connectMongo();
    await Db.syncStatus();
    await Db.syncRole();
  });

  // afterAll(async () => {
  //   Db.disconnectMongo();
  //   Db.dropMongoDb();
  // });

  describe("Should test the new user api", () => {
    const newUserwithErr = { fullname: "test error", dateOfBirth: "2004-11-12", role: "Admin", email: "me@.com" };
    const newUser = {
      fullname: "test ok",
      dateOfBirth: "2004-11-12",
      role: "Patient",
      email: "me@adetunjim.com",
      phone: "+123454231526",
    };

    it("Should return 422 reponse", async () => {
      await appRequest.post(`${authUrl}/new`).send(newUserwithErr).expect(422);
    });

    // it("Should return 401 reponse since user not logged in", async () => {
    //   await appRequest.post(`${authUrl}/new`).send(newUser).expect(401);
    // });
  });
});
