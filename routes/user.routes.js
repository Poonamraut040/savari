import {Router} from "express";
import { registerUser,loginUser,getUserProfile, logoutUser } from "../controllers/user.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser);
router.route("/userProfile").get(verifyJWT,getUserProfile);
router.route("/logoutUser").get(verifyJWT, logoutUser)

export default router;