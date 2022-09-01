//Middleware que nos permitirá configurar donde se guardará la imagen subida 
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from "path";

const storage = multer.diskStorage({
    destination:  'images',
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
})

export const upload = multer({
    storage,
}).single('file');