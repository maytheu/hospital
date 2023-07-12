import { Request } from "express";
import mongoose, { ObjectId } from "mongoose";

import Lab from "../model/laboratory.model";
import Role from "../model/role.model";
import {
  ILaboratory,
  ILaboratoryData,
  ILaboratoryNewData,
  ILaboratoryUpdateData,
} from "../utils/interface/laboratory.interface";
import User from "../model/user.model";
import { forbiddenError, notFoundError } from "./error";

interface LabObj {
  name: QueryOptions;
  result: QueryOptions;
  description: QueryOptions;
  sort: string;
  page: string;
  limit: string;
  patient: string;
  conductedBy: string;
}

interface QueryOptions {
  $regex: string;
  $options: string;
}

class LabService {
  /**
   *
   * @param req get all query
   * @param user user frrom request
   * @returns
   */
  allResult = async (req: Request, user: any): Promise<any> => {
    try {
      const role = await Role.findById(user.role, "name");
      let labs;
      //parse query
      const {
        query: { name, result, description, sort, page, limit },
      } = req;
      const labQuery = <LabObj>{};
      if (name) labQuery.name = { $regex: <string>name, $options: "i" };
      if (result) labQuery.result = { $regex: <string>result, $options: "i" };
      if (description) labQuery.description = { $regex: <string>description, $options: "i" };

      //make query
      if (role?.name === "Admin") {
        //load all labs for admin
        labs = Lab.find(labQuery, "-_id -__v");
      } else if (role?.name === "Patient") {
        labQuery.patient = user.id;
        labs = Lab.find(labQuery, "-_id -__v");
      } else {
        labQuery.conductedBy = user.id;
        labs = Lab.find(labQuery, "-_id -__v");
      }

      //sorting
      if (sort) {
        const sortBy = (sort as string).split(",").join(" ");
        labs = labs.sort(sortBy);
      } else labs = labs.sort("-createdAt");

      //paggination
      const labPage = +(page as string) || 1;
      const labLimit = +(limit as string) || 10;
      const skip = (labPage - 1) * labLimit;
      labs = labs.skip(skip).limit(labLimit);

      //make query
      const allLabs = await labs
        .populate({ path: "patient", select: "fullname" })
        .populate({ path: "conductedBy", select: "fullname" });

      return { data: allLabs, count: allLabs.length, page: labPage };
    } catch (error) {
      return error;
    }
  };

  lab = async (labId: string, roleId: string, id: string): Promise<any> => {
    try {
      if (!mongoose.isValidObjectId(labId)) return notFoundError("Resource");
      const role = await Role.findById(roleId, "name");
      if (role?.name === "Admin" || role?.name === "Doctor") {
        return await Lab.findById(labId, "-__v")
          .populate({ path: "conductedBy", select: "fullname" })
          .populate({ path: "patient", select: "fullname" });
      }
      if (role?.name === "Nurse") return forbiddenError();
      return await Lab.findOne({ _id: labId, patientId: id }, "-__v").populate({
        path: "conductedBy",
        select: "fullname",
      });
    } catch (error) {
      return error;
    }
  };

  /**
   *
   * @param data body object
   * @param id registered by
   * @returns
   */
  newlab = async (data: ILaboratoryNewData, id: any): Promise<any> => {
    try {
      const user = await User.findOne({ email: data.email }, "fullname id");
      if (!user) return notFoundError("Patient");

      const labData: ILaboratory = {
        patient: user.id,
        conductedBy: id,
        name: data.name,
        description: data.description,
        result: data.result,
      };

      return await Lab.create(labData);
    } catch (error) {
      return error;
    }
  };

  /**
   *
   * @param data
   * @param labId lab result to update
   * @param registra the admin who registred the test
   * @returns
   */
  updateLab = async (data: ILaboratoryUpdateData, labId: any, registra: any): Promise<any> => {
    try {
      let lab;
      if (!mongoose.isValidObjectId(labId)) return notFoundError("Resources");

      const role = await Role.findById(registra.role, "name");
      if (role?.name === "Admin") {
        lab = await Lab.findById(labId, "patientId conductedBy");
      } else lab = await Lab.findOne({ _id: labId, conductedBy: registra.id }, "patientId conductedBy");
      if (!lab) return notFoundError("Resources");

      return await Lab.findByIdAndUpdate(labId, data, { upsert: true });
    } catch (error) {
      return error;
    }
  };
}

export default new LabService();
