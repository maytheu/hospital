import mongoose from "mongoose";
import { Request } from "express";

import Medication from "../model/medication.model";
import User from "../model/user.model";
import { IMedicaton, IMedicatonNewData, IMedicatonUpdateData } from "../utils/interface/medication.interface";
import { forbiddenError, notFoundError } from "./error";
import Role from "../model/role.model";
import { MedObj } from "../utils/interface/utils.interface";

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

  medicals = async (req: Request): Promise<any> => {
    try {
      //build object
      const { treatment, drugs, duration, frequency, email, admin, sort, page, limit } = req.query;
      const { user } = req;
      const medObj = <MedObj>{};
      let meds,
        userData: any = user;
      if (treatment) medObj.treatment = { $regex: <string>treatment, $options: "i" };
      if (drugs) medObj.drugsAndDosage = { $regex: <string>drugs, $options: "i" };
      if (duration) medObj.duration = { $regex: <string>duration, $options: "i" };
      if (frequency) medObj.frequency = { $regex: <string>frequency, $options: "i" };
      if (admin) medObj.conductedBy = user?.id;

      //manage roles
      let medCount;
      const role = await Role.findById(user?.role, "name");
      if (role?.name === "Admin" || role?.name === "Doctor") {
        if (email) {
          //if doctor want to view report of a patient
          const patient = await User.findOne({ email }, "fullname email -__v -_id");
          userData = patient;
          medObj.patient = patient?.id;
        }
        //doctors and admin can view all report
        meds = Medication.find(medObj, "-patient");
        medCount = await Medication.find(medObj).count();
      } else {
        medObj.patient = user!.id;
        meds = Medication.find(medObj, "-patient");
        medCount = await Medication.find(medObj).count();
      }

      //sorting
      if (sort) {
        const sortBy = (sort as string).split(",").join(" ");
        meds = meds.sort(sortBy);
      } else meds = meds.sort("-createdAt");

      //paggination
      const medPage = +(page as string) || 1;
      const medLimit = +(limit as string) || 10;
      const skip = (medPage - 1) * medLimit;
      meds = meds.skip(skip).limit(medLimit);

      const allReports = await meds.populate({ path: "conductedBy", select: "fullname" });
      return {
        report: allReports,
        user: { name: userData.fullname, email: userData.email },
        count: medCount,
        page: medPage,
        limit: medLimit,
      };
    } catch (error) {
      return error;
    }
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

  updateMedical = async (medId: any, data: IMedicatonUpdateData, registra: any) => {
    try {
      let med;
      if (!mongoose.isValidObjectId(medId)) return notFoundError("Resources");

      const role = await Role.findById(registra.role, "name");
      if (role?.name === "Admin" || role?.name === "Doctor") {
        return await Medication.findByIdAndUpdate(medId, data, { upsert: true });
      } else med = await Medication.findOne({ _id: medId, conductedBy: registra.id });      
      if (!med) return forbiddenError();
      
      return Medication.findByIdAndUpdate({ _id: medId, conductedBy: registra.id }, data, { upsert: true });
    } catch (error) {
      return error;
    }
  };
}

export default new MedicalService();
