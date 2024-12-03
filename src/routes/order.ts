import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { orderController } from "../controllers/order.controller";

const router = Router();

router.get('/list', orderController.getOrders)
router.get('/constructor/list', orderController.getConstructorOrders)
router.get('/list/:id', orderController.getUserOrders)
router.get('/status', orderController.getOrdersByStatus)
router.post('/constructor', orderController.createConstructorOrder)
router.post('/', orderController.createOrder)
router.put('/status', orderController.updateOrderStatus)

export default router;