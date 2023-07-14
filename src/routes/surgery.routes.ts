import { Router } from "express";
import UtilsService from "../services/Utils.service";
import SurgeryCtrl from "../controller/Surgery.ctrl";

const surgeryRouter = Router();

surgeryRouter.get("/", UtilsService.authentication, SurgeryCtrl.allProcedure);
surgeryRouter.get("/:surgeryId", UtilsService.authentication, SurgeryCtrl.procedure);
surgeryRouter.post("/new", UtilsService.authentication, UtilsService.doctorAuthorization, SurgeryCtrl.newProcedure);
surgeryRouter.put(
  "/update/:surgeryId",
  UtilsService.authentication,
  UtilsService.doctorAuthorization,
  SurgeryCtrl.updateProcedure
);
surgeryRouter.get("/", UtilsService.authentication, UtilsService.adminAuthorization, SurgeryCtrl.deleterocedure);
export default surgeryRouter;
