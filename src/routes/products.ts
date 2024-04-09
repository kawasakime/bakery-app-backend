import { Router } from "express";
import { productsController } from "../controllers/products.controller";
import {v4 as uuidv4} from 'uuid'
import * as multer from 'multer';
import * as path from 'path';

const router = Router();

// создание хранилища для сохранения фото
const storage = multer.diskStorage({
  destination: "./src/assets/images/",
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)) 
})
const upload = multer({storage, limits: { fieldSize: 25 * 1024 * 1024 }});

router.get('/', productsController.getAll);
router.get('/:id', productsController.getOne);
router.post('/', upload.single('image'), productsController.create);
router.delete('/', productsController.delete)

export default router;