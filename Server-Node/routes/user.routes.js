import { Router } from "express";

const router = Router();

import {
  signUp,
  signIn,
  refreshToken,
  logout,
  forgotPassword,
  updatePassword,
  editUser,
  userInfo
} from "../controllers/user.js";
import auth from "../middlewares/authJwt.js";


//import { verifyUser } from '../middlewares/verifyUser.js'
import { upload } from '../middlewares/multer.js'

//Ruta que te permite registrarte
router.post("/signup", signUp);

//Ruta que te permite iniciar sesión
router.post("/signin", signIn);

//Ruta que te permite obtener un nuevo access token
router.get("/refreshToken", refreshToken);

//Ruta que te permite eliminar el refresh token
router.delete("/logout", logout);

router.post("/forgotPassword", forgotPassword);

router.put("/updatePassword", updatePassword);

router.put("/editUser", upload, editUser)

router.get('/userInfo', auth, userInfo)

export default router;
