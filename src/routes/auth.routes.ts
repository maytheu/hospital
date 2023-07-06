import { Router } from "express";

import AuthCtrl from "../controller/Auth.ctrl";
import UtilsService from "../services/Utils.service";

const authRouter = Router();

authRouter.post("/new", AuthCtrl.newUser);
authRouter.post('/login', AuthCtrl.login)
authRouter.get('/me', UtilsService.authentication, AuthCtrl.profile)
authRouter.put('/update-password', UtilsService.authentication, AuthCtrl.updatePassword)

export default authRouter;
