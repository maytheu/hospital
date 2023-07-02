import "dotenv/config";
import mongoose from "mongoose";

import secret from "../utils/validateEnv";
import { IStatus } from "../utils/interface/status.interface";
import Status from "../model/Status.model";
import { IRole } from "../utils/interface/role.interface";
import Role from "../model/role.model";

class Db {
  mongoUrl = secret.MONGODB;

  constructor() {
    mongoose.connection.once("open", () => console.log("Database connected"));
    mongoose.connection.on("error", async (e) => {
      console.log(e);
      await this.disconneectMongo();
    });
  }

  async connectMongo() {
    await mongoose.connect(this.mongoUrl);
  }

  disconneectMongo = async () => {
    await mongoose.disconnect();
  };

  syncStatus = async () => {
    const statusBulkWite = this.statusData.map((el) => {
      return {
        updateOne: {
          filter: { name: el.name },
          update: { name: el.name },
          runValidators: true,
          upsert: true,
        },
      };
    });

    // await Status.bulkWrite(statusBulkWite);
  };

  syncRole = async () => {
    const roleBulkWrite = this.roleData.map((role) => {
      return {
        updateOne: {
          filter: { name: role.name },
          update: { name: role.name },
          upsert: true,
        },
      };
    });

    await Role.bulkWrite(roleBulkWrite);
  };

  private statusData: IStatus[] = [
    { name: "Active" },
    { name: "Inactive" },
    { name: "Suspended" },
    { name: "Busy" },
    { name: "Leave of Absence" },
    { name: "Processing" },
    { name: "Critical" },
    { name: "Good" },
    { name: "Fair" },
    { name: "Serious" },
    { name: "Undetermined" },
  ];

  private roleData: IRole[] = [{ name: "Admin" }, { name: "Doctor" }, { name: "Nurse" }, { name: "Patient" }];
}

export default new Db();
