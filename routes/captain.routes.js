import {Router} from "express";
import { registerCaptain, loginCaptain,getCaptainProfile,logoutCaptain } from "../controllers/captain.controller.js";
import { verifyCaptain } from "../middleware/auth.middleware.js";


const router = Router();

router.route("/registerCaptain").post(registerCaptain);
router.route("/loginCaptain").post(loginCaptain);
router.route("/CaptainProfile").get(verifyCaptain,getCaptainProfile);
router.route("/logoutCaptain").get(verifyCaptain, logoutCaptain);


export default router;