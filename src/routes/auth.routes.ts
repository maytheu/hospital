import { Router } from "express";

import AuthCtrl from "../controller/Auth.ctrl";
import UtilsService from "../services/Utils.service";

const authRouter = Router();

authRouter.post("/new", UtilsService.authentication, UtilsService.adminAuthorization, AuthCtrl.newUser);
authRouter.post("/login", AuthCtrl.login);
authRouter.get("/me", UtilsService.authentication, AuthCtrl.profile);
authRouter.put("/update-password", UtilsService.authentication, AuthCtrl.updatePassword);
authRouter.put("/update-profile", UtilsService.authentication, AuthCtrl.updateProfile);

export default authRouter;
