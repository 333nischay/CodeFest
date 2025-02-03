import {Router} from "express";
import { getWorkSpace, login, logOut, refreshAccessToken, register, verifyOtpRegistration ,forgotPassword,verifyForgotPassword,googleLogin,googleCallback} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(verifyUser,logOut);
router.route('/refresh').post(refreshAccessToken);
router.route('/verifyRegistration').post(verifyOtpRegistration);
router.route('/getWorkSpace').get(verifyUser,getWorkSpace);
router.route('/forgotPassword').post(forgotPassword);
router.route('/verifyForgotPassword').post(verifyForgotPassword);
router.route('/google').get(googleLogin);
router.route('/google/callback').get(googleCallback);



export default router;