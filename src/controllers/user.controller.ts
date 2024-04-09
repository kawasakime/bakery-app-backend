import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { User } from "../entity/User";
import { Request, Response } from "../interfaces/express";
import { handleError } from "../utils/handlers";
import { countReset } from "console";

export const userController = {
  getInfo: async (req: Request, res: Response) => {
    try {
      const user = await AppDataSource.getRepository(User).findOneBy({
        id: Number(req.query.id),
      })

      const favorites = await JSON.parse(user.favorites)

      res.send({...user, favorites})
    } catch (error) { handleError(error, res) }
  },
  update: async (req: Request, res: Response) => {
    try {
      const user = await AppDataSource.getRepository(User).findOneBy({
        id: Number(req.query.id),
      })
      AppDataSource.getRepository(User).merge(user, req.body)
      const results = await AppDataSource.getRepository(User).save(user)
      console.log(results)
      return res.send({message: 'Данные обновлены', data: results})
    } catch (error) { handleError(error, res) }
  },
  getFavorites: async (req: Request, res: Response) => {
    try {
      const {favorites} = await AppDataSource.getRepository(User).findOne({
        where: {
          id: Number(req.query.id)
        },
        select: {
          favorites: true
        }
      })

      const favoritesArray = await JSON.parse(favorites)

      console.log('FAVORITES', favoritesArray)

      const products = await AppDataSource.getRepository(Product).find({
        where: { id: In(favoritesArray) }
      })

      console.log('PRODUCTS', products)

      return res.send(products ?? [])
    } catch (error) { handleError(error, res )}
  },
  addFavorite: async (req: Request, res: Response) => {
    try {
      const user = await AppDataSource.getRepository(User).findOneBy({
        id: Number(req.query.id),
      })

      const favoritesArray = await JSON.parse(user.favorites);

      AppDataSource.getRepository(User).merge(user, {favorites: JSON.stringify([...favoritesArray, req.body.productId])})
      const result = await AppDataSource.getRepository(User).save(user)

      return res.send({message: 'Продукт добавлен в избранное', data: await JSON.parse(result.favorites)})
    } catch (error) { handleError(error, res) }
  },
  removeFavorite: async (req: Request, res: Response) => {
    try {
      const user = await AppDataSource.getRepository(User).findOneBy({
        id: Number(req.query.id),
      })

      const favoritesArray = await JSON.parse(user.favorites);
      const filteredFavorites = favoritesArray.filter(item => item !== req.body.productId)

      AppDataSource.getRepository(User).merge(user, {favorites: JSON.stringify(filteredFavorites)})
      const result = await AppDataSource.getRepository(User).save(user)

      return res.send({message: 'Продукт удалён из избранного', data: await JSON.parse(result.favorites)})

    } catch (error) { handleError(error, res) }
  },
  getCart: async (req: Request, res: Response) => {
    try {
      console.log('GETTING')
      const {cart} = await AppDataSource.getRepository(User).findOne({
        where: {
          id: Number(req.query.id)
        },
        select: {
          cart: true
        }
      })

      // array {id, count}
      const cartArray = await JSON.parse(cart) as {id: number, count: number}[]

      const products = await AppDataSource.getRepository(Product).find({
        where: { id: In(cartArray.map(item => item.id)) }
      })

      console.log('PRODUCTS', products);
      console.log('CART ARRAY', cartArray);

      return res.send(products.map(item => ({item, count: cartArray.find(product => product.id === item.id).count})) ?? [])
    } catch (error) { handleError(error, res )}
  },
  updateCart: async (req: Request, res: Response) => {
    try {
      const user = await AppDataSource.getRepository(User).findOneBy({
        id: Number(req.query.id),
      })

      const cartArray = await JSON.parse(user.cart);

      const {productId, count} = req.body;

      const inArray = cartArray.find(item => item.id === productId);

      let currentCart = [];

      if (count === 0) {
          currentCart = cartArray.filter(item => item.id !== productId);
      } else {
        const currentCount = cartArray.find(item => item.id === productId)?.count

        console.log(count, currentCount)

        currentCart = inArray 
          ? cartArray.map(item => item.id === productId ? {id: productId, count: count} : item)  
          : [...cartArray, {id: productId, count: 1}]
      }

      AppDataSource.getRepository(User).merge(user, {cart: JSON.stringify(currentCart)})
      const result = await AppDataSource.getRepository(User).save(user)

      console.log('RESULT', result)

      return res.send({message: 'Корзина обновлена', data: await JSON.parse(result.cart)})
    } catch (error) { handleError(error, res) }
  },
}