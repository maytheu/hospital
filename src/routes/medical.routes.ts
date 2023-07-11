import { Router } from "express";

import MedicalCtrl from "../controller/Medical.ctrl";
import UtilsService from "../services/Utils.service";

const medicalRouter = Router();

medicalRouter.get("/", UtilsService.authentication, MedicalCtrl.medicals);
medicalRouter.get("/:medId", UtilsService.authentication, MedicalCtrl.medical);
medicalRouter.post("/new", UtilsService.authentication, UtilsService.authorization, MedicalCtrl.newMedical);
medicalRouter.put("/update/:medId", UtilsService.authentication, UtilsService.authorization, MedicalCtrl.updateMedical);

export default medicalRouter;
