import * as express from 'express';
import { Request, Response } from '../interfaces/express';

export const handleError = (error: any, res: express.Response) => {
  console.log(error)
  res.status(500);
  res.send({message: error?.message ?? 'Произошла ошибка'})
}