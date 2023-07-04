import { Router } from "express";

import AuthCtrl from "../controller/Auth.ctrl";

const authRouter = Router();

authRouter.post("/new", AuthCtrl.newUser);

export default authRouter;
