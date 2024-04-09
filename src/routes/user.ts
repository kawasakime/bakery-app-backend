import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

router.get('/', userController.getInfo)
router.post('/update', userController.update);
router.get('/favorites', userController.getFavorites);
router.post('/favorites', userController.addFavorite);
router.delete('/favorites', userController.removeFavorite);
router.get('/cart', userController.getCart);
router.post('/cart', userController.updateCart);

export default router;