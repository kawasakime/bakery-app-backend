import { Router } from "express";
import auth from "./auth";
import user from "./user";
import products from "./products";
import orders from "./order";
import authenticateToken from "../utils/authenticateToken";

const routes = Router();

routes.use('/auth', auth)
routes.use('/products', products)
routes.use('/user', authenticateToken, user)
routes.use('/order', authenticateToken, orders)

export default routes;