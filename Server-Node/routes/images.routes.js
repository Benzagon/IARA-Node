import { Router } from "express";
const router = Router();

import {
  uploadImage,
  getImages,
  getImage,
  deleteImage,
  sendFile,
} from "../controllers/images.js";
import { upload } from "../middlewares/multer.js";

//Definiendo rutas de la aplicación

//Ruta que te permite subir una imagen
router.post("/images/upload/:id_paciente", upload, uploadImage);

//Ruta que te permite obtener todas las imagenes que subiste
router.get("/images/:id", getImages);

//Ruta que te permite obtener solo una imagen
router.get("/images/:id/:id_paciente", getImage);

//Ruta que te permite eliminar una imagen
router.delete("/images/:id/:id_paciente", deleteImage);

router.post("/images/sendFile", sendFile);

export default router;
