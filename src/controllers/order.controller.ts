import { In, UsingJoinColumnOnlyOnOneSideAllowedError } from "typeorm"
import { AppDataSource } from "../data-source"
import { ConstructorOrder } from "../entity/ConstructorOrder"
import { Order } from "../entity/Order"
import { Product } from "../entity/Product"
import { User } from "../entity/User"
import { Request, Response } from '../interfaces/express';
import { handleError } from "../utils/handlers"
import { OrderStatus } from "../entity/enums/OrderStatus"

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
  getUserOrders: async (req: Request, res: Response) => {
    try {
      const orders = await AppDataSource.getRepository(Order).find({
        where: {
          id: req.query.id as unknown as number
        }
      });

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
    } catch (error) {handleError(error, res)}
  },
  getConstructorOrders: async (req: Request, res: Response) => {
    try {
      const orders = await AppDataSource.getRepository(ConstructorOrder).find();
      res.send(await Promise.all(orders.map(async item => ({...item, params: await JSON.parse(item.params) }))))
    } catch (error) { handleError(error, res) }
  },
  updateOrderStatus: async (req: Request, res: Response) => {
    try {
      const { orderId, status } = req.body;
      
      if (!Object.values(OrderStatus).includes(status)) {
        return res.status(400).send({ message: 'Некорректный статус заказа' });
      }

      const order = await AppDataSource.getRepository(Order).findOne({
        where: { id: orderId }
      });

      if (!order) {
        return res.status(404).send({ message: 'Заказ не найден' });
      }

      order.status = status;
      await AppDataSource.getRepository(Order).save(order);

      res.send({ message: 'Статус заказа успешно обновлен', data: order });
    } catch (error) { handleError(error, res) }
  },

  getOrdersByStatus: async (req: Request, res: Response) => {
    try {
      const { status } = req.query;
      
      if (status && !Object.values(OrderStatus).includes(status as OrderStatus)) {
        return res.status(400).send({ message: 'Некорректный статус заказа' });
      }

      const orders = await AppDataSource.getRepository(Order).find({
        where: status ? { status: status as OrderStatus } : {}
      });

      const cartArray = await Promise.all(orders.map(
        async item => {
          const array = await JSON.parse(item.products);
          const products = await AppDataSource.getRepository(Product).find({
            where: { id: In(array.map(prod => prod.id)) }
          });

          const counts = products.map(p => (array.find(pa => pa.id === p.id).count));
          const currentProducts = products.map(((p, index) => ({...p, count: counts[index]})));
          
          return {
            ...item, 
            products: currentProducts
          };
        }
      ));

      res.send(cartArray);
    } catch (error) { handleError(error, res) }
  }
}