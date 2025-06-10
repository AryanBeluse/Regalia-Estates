import express from 'express';
import {
    signup,
    signinUser,
    signinBroker,
    googleAuth,
    loginAdmin
} from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/signup", signup)
authRouter.post("/signin", signinUser)
authRouter.post("/signin-broker", signinBroker)
authRouter.post("/google-auth", googleAuth)
authRouter.post("/admin-login", loginAdmin)



export default authRouter;