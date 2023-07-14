import Surgery from "../model/surgery.model";
import User from "../model/user.model";
import { ISurgeryData } from "../utils/interface/surgery.interface";
import { notFoundError } from "./error";

class SurgeryService {
  newProcedure = async (data: ISurgeryData, by: any):Promise<any> => {
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
