import { In, UsingJoinColumnOnlyOnOneSideAllowedError } from "typeorm"
import { AppDataSource } from "../data-source"
import { ConstructorOrder } from "../entity/ConstructorOrder"
import { Order } from "../entity/Order"
import { Product } from "../entity/Product"
import { User } from "../entity/User"
import { Request, Response } from "../interfaces/express"
import { handleError } from "../utils/handlers"

export const orderController = {
  createConstructorOrder: async (req: Request, res: Response) => {
    try {
      const order = AppDataSource.getRepository(ConstructorOrder).create(req.body)
      const results = await AppDataSource.getRepository(ConstructorOrder).save(order)

      res.send({message: 'Заявка успешно отправлена.\nМы свяжемся с вами в течении 5 минут', data: results})
    } catch (error) { handleError(error, res) }
  },
  createOrder: async (req: Request, res: Response) => {
    try {
      const order = AppDataSource.getRepository(Order).create(req.body)
      const results = await AppDataSource.getRepository(Order).save(order)

      await AppDataSource.getRepository(User).update(req.body.clientId, {cart: '[]'});

      res.send({message: 'Заказ успешно создан.\nМы свяжемся с вами в течении 5 минут для уточнения деталей.', data: results})
    } catch (error) { handleError(error, res) }
  },
  getOrders: async (req: Request, res: Response) => {
    try {
      const orders = await AppDataSource.getRepository(Order).find();

      const cartArray = await Promise.all(orders.map(
        async item => {

          const array = await JSON.parse(item.products);

          const products = await AppDataSource.getRepository(Product).find({
            where: { id: In(array.map(prod => prod.id)) }
          })

          const counts = products.map(p => (array.find(pa => pa.id === p.id).count))
          const currentProducts = products.map(((p, index) => ({...p, count: counts[index]})))
          
          return {
            ...item, 
            products: currentProducts
          }
        }
      ))

      res.send(cartArray)
    } catch (error) { handleError(error, res) }
  },
  getConstructorOrders: async (req: Request, res: Response) => {
    try {
      const orders = await AppDataSource.getRepository(ConstructorOrder).find();
      res.send(await Promise.all(orders.map(async item => ({...item, params: await JSON.parse(item.params) }))))
    } catch (error) { handleError(error, res) }
  },

}