import mongoose from "mongoose";

import Medication from "../model/medication.model";
import User from "../model/user.model";
import { IMedicaton, IMedicatonNewData } from "../utils/interface/medication.interface";
import { notFoundError } from "./error";
import Role from "../model/role.model";

class MedicalService {
  medical = async (medId: string, roleId: string, conducted: string): Promise<any> => {
    if (!mongoose.isValidObjectId(medId)) return notFoundError("Resource");

    const role = await Role.findById(roleId, "name");
    if (role?.name === "Admin" || role?.name === "Doctor")
      return await Medication.findById(medId, "-__v -_id")
        .populate({ path: "patient", select: "fullname" })
        .populate({ path: "conductedBy", select: "fullname" });

    if (role?.name === "Nurse")
      return await Medication.findOne({ _id: medId, conductedBy: conducted }, "-__v -_id")
        .populate({ path: "patient", select: "fullname" })
        .populate({ path: "conductedBy", select: "fullname" });

    return await Medication.findById(medId, "-__v -_id")
      .populate({ path: "patient", select: "fullname" })
      .populate({ path: "conductedBy", select: "fullname" });
  };

  newMedical = async (data: IMedicatonNewData, created: any): Promise<any> => {
    try {
      const user = await User.findOne({ email: data.email }, "id");
      if (!user) return notFoundError("Patient");

      const newMedical: IMedicaton = { patient: user.id, conductedBy: created, ...data };
      return await Medication.create(newMedical);
    } catch (error) {
      return error;
    }
  };
}

export default new MedicalService();
