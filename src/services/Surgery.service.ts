import mongoose from "mongoose";

import Surgery from "../model/surgery.model";
import User from "../model/user.model";
import { ISurgeryData } from "../utils/interface/surgery.interface";
import { forbiddenError, notFoundError } from "./error";
import UtilsService from "./Utils.service";

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
}

export default new SurgeryService();
