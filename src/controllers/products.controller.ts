import { imagesRoute } from "../constants";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { Request, Response } from "../interfaces/express";
import { handleError } from "../utils/handlers";

export const productsController = {
  getAll: async (_: Request, res: Response) => {
    try {
      const products = await AppDataSource.getRepository(Product).find();
      res.send(products)
    } catch (error) { handleError(error, res) }
  },
  getOne: async (req: Request, res: Response) => {
    try {
      const product = await AppDataSource.getRepository(Product).findOneBy({
        id: Number(req.params.id),
      })
      AppDataSource.getRepository(Product).merge(product, req.body)
      const results = await AppDataSource.getRepository(Product).save(product)
      res.send(results)
    } catch (error) { handleError(error, res) }

  },
  create: async (req: Request, res: Response) => {
    try {
      const imageUrl = imagesRoute + req.file.filename;
      const product = AppDataSource.getRepository(Product).create({...req.body, imageUrl } as Product)
      const results = await AppDataSource.getRepository(Product).save(product)

      res.send({message: 'Товар создан', data: results})
    } catch (error) { handleError(error, res) }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const result = await AppDataSource.getRepository(Product).createQueryBuilder().delete().where('id = :id', {id: req.body.productId }).execute();
      
      console.log(result)
      res.send({message: 'Товар удалён'})

    } catch (error) { handleError(error, res) }
  }
}