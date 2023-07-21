import { Router } from "express";
import UtilsService from "../services/Utils.service";
import SurgeryCtrl from "../controller/Surgery.ctrl";

const surgeryRouter = Router();

surgeryRouter.get("/", UtilsService.authentication, SurgeryCtrl.allProcedure);
surgeryRouter
  .route("/:surgeryId")
  .get(UtilsService.authentication, SurgeryCtrl.procedure)
  .delete(UtilsService.authentication, UtilsService.adminAuthorization, SurgeryCtrl.deleteProcedure);
surgeryRouter.post("/new", UtilsService.authentication, UtilsService.doctorAuthorization, SurgeryCtrl.newProcedure);
surgeryRouter.put(
  "/update/:surgeryId",
  UtilsService.authentication,
  UtilsService.doctorAuthorization,
  SurgeryCtrl.updateProcedure
);
export default surgeryRouter;
