import dotenv from "dotenv";

dotenv.config({ path: ".test.env" });

import Db from "../../src/services/Db";
import UtilService from "../../src/services/Utils.service";

describe("Should test util component", () => {
  beforeAll(async () => {
    await Db.connectMongo();
    await Db.syncStatus();
    await Db.syncRole();
  });

  // afterAll(async () => {
  //   Db.disconnectMongo();
  //   Db.dropMongoDb();
  // });

  it("Should return an id from status", async () => {
    const sts = await UtilService.getStatusId({ name: "Active" });
    expect(sts).toBeTruthy();
  });

  it("Should return an id from role", async () => {
    const sts = await UtilService.getRoleById({name:"Doctor"});
    expect(sts).toBeTruthy();
  });

});
