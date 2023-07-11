import { Router } from "express";

import UtilsService from "../services/Utils.service";
import Laboratory from "../controller/Lab.ctrl";

const laboratoryRouter = Router();

laboratoryRouter.get("/", UtilsService.authentication, Laboratory.allResult);
laboratoryRouter.get("/:labId", UtilsService.authentication, Laboratory.lab);
laboratoryRouter.post("/new", UtilsService.authentication, UtilsService.authorization, Laboratory.newLab);
laboratoryRouter.put("/update/:labId", UtilsService.authentication, UtilsService.authorization, Laboratory.update);

export default laboratoryRouter;
