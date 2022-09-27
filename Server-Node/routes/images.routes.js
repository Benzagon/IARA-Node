import { Router } from "express";
const router = Router();

import {
  uploadImage,
  getImages,
  getImage,
  deleteImage,
  sendFile,
  saveImageRoute
} from "../controllers/images.js";
import { upload } from "../middlewares/multer.js";

//Definiendo rutas de la aplicación

//Ruta que te permite subir una imagen
router.post("/images/upload/:id_paciente", upload, uploadImage);

router.post("/images/saveImageRoute", upload, saveImageRoute);

//Ruta que te permite obtener todas las imagenes que subiste
router.get("/images/:id", getImages);

//Ruta que te permite obtener solo una imagen
router.get("/images/:id_paciente/:id", getImage);

//Ruta que te permite eliminar una imagen
router.delete("/images/:id_paciente/:id", deleteImage);

router.post("/images/sendFile", sendFile);



export default router;
