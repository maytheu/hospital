import mongoose from "mongoose";
import { Request } from "express";

import Surgery from "../model/surgery.model";
import User from "../model/user.model";
import { ISurgeryData, ISurgeryUpdateData } from "../utils/interface/surgery.interface";
import { forbiddenError, notFoundError } from "./error";
import UtilsService from "./Utils.service";
import { SurObj } from "../utils/interface/utils.interface";

class SurgeryService {
  procedure = async (surgeryId: string, roleId: string, userId: string): Promise<any> => {
    try {
      if (!mongoose.isValidObjectId(surgeryId)) return notFoundError("Surgery record");

      const role = await UtilsService.getRoleName(roleId);
      if (role?.name === "Admin" || role?.name === "Doctor") {
        return await Surgery.findById(surgeryId).populate({ path: "patient", select: "fullname email phone address" });
      } else {
        //if nurse, should only be available for nurse/patient to view thrier profile
        const procedure = await Surgery.findOne({ _id: surgeryId, patient: userId }).populate({
          path: "patient",
          select: "fullname email phone address",
        });
        if (procedure) return procedure;
        else return forbiddenError();
      }
    } catch (error) {
      return error;
    }
  };

  newProcedure = async (data: ISurgeryData, by: any): Promise<any> => {
    try {
      const user = await User.findOne({ email: data.email }, "id");
      if (!user) return notFoundError("Patient");

      const saveProcedure = new Surgery({ ...data, patient: user.id, conductedBy: by });

      await saveProcedure.save();
      return { surgeryId: saveProcedure.id, procedure: saveProcedure.procedure, name: saveProcedure.name };
    } catch (error) {
      return error;
    }
  };

  allProcedure = async (req: Request): Promise<any> => {
    try {
      const {
        query: { name, desc, result, patientId, page, limit, sort },
        user,
      } = req;
      const surObj = <SurObj>{};
      let projection: string = "";
      let patientData;

      const role = await UtilsService.getRoleName(user?.role);

      if (name) surObj.name = { $regex: <string>name, $options: "i" };
      if (desc) surObj.description = { $regex: <string>desc, $options: "i" };
      if (result) surObj.result = { $regex: <string>result, $options: "i" };
      if (patientId) {
        if (mongoose.isValidObjectId(patientId)) surObj.patient = <string>patientId;
      }
      if (role?.name === "Nurse" || role?.name === "Patient") {
        surObj.patient = user?.id;
        projection = "-patient";
        patientData = { name: user?.fullname, email: user?.email };
      }

      let surgerys = Surgery.find(surObj, projection);
      const surgeryCount = await Surgery.find(surObj, projection).count();

      //sorting
      if (sort) {
        const sortBy = (sort as string).split(",").join(" ");
        surgerys = surgerys.sort(sortBy);
      } else surgerys = surgerys.sort("-createdAt");

      //paggination
      const surPage = +(page as string) || 1;
      const surLimit = +(limit as string) || 10;
      const skip = (surPage - 1) * surLimit;
      surgerys = surgerys.skip(skip).limit(surLimit);

      const allProcedure = await surgerys;
      return {
        procedure: allProcedure,
        patient: patientData,
        count: surgeryCount,
        page: surPage,
        limit: surLimit,
      };
    } catch (error) {
      return error;
    }
  };

  updateProcedure = async (data: ISurgeryUpdateData, procedureId: any): Promise<any> => {
    try {
      if (!mongoose.isValidObjectId(procedureId)) return notFoundError("Procedure");

      const procedure = await Surgery.findByIdAndUpdate(procedureId, data, { upsert: true });
      return procedure;
    } catch (error) {}
  };

  deleteProcedure = async (id: string): Promise<any> => {
    try {
      if (!mongoose.isValidObjectId(id)) return notFoundError("Procedure");

      return await Surgery.findByIdAndUpdate(id, { deleted: true });
    } catch (error) {
      return error;
    }
  };
}

export default new SurgeryService();
