import { Next, Request, Response } from "../interfaces/express";

const jwt = require('jsonwebtoken');

export default (req: Request, res: Response, next: Next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, login: any) => {
    console.log(err)
    if (err) return res.sendStatus(403)

    next()
  })
}
