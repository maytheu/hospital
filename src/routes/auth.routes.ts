import { Router } from "express";

import AuthCtrl from "../controller/Auth.ctrl";

const authRouter = Router();

authRouter.post("/new", AuthCtrl.newUser);
authRouter.post('/login', AuthCtrl.login)

export default authRouter;
