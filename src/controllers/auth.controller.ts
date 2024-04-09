import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { Request, Response } from "../interfaces/express"
import { Register } from "../interfaces/requests"
import { Encrypt } from "../utils/encrypt"
import generateAcessToken from "../utils/generateAcessToken"
import { handleError } from "../utils/handlers"

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const password = await Encrypt.cryptPassword(req.body.password);

      const user = AppDataSource.getRepository(User).create({ ...req.body, password } as Register)
      const results = await AppDataSource.getRepository(User).save(user)

      const accessToken = await generateAcessToken(user.login);

      res.send({message: 'Пользователь создан', data: results, accessToken})
    } catch (error) { handleError(error, res) }
  },
  login: async (req: Request, res: Response) => {
    try {
      console.log(req.body)
      const user = await AppDataSource.getRepository(User).findOneBy({
        login: req.body.login,
      })
      
      if (user) {
        const { password } = await AppDataSource.getRepository(User).findOne({
          where: { login: req.body.login, },
          select: { password: true }
        })

        const passwordIsCorrect = await Encrypt.comparePassword(req.body.password, password)

        if (passwordIsCorrect) {
          const accessToken = await generateAcessToken(user.login);
          res.send({...user, accessToken})
        } else {
          res.status(500).send({message: 'Неправильный пароль.'})
        }

      } else {
        res.status(500).send({message: 'Пользователь с такими данными не найден.'})
      }
    } catch (error) { handleError(error, res) }
  }
}