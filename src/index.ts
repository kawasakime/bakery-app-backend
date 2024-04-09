import { AppDataSource } from "./data-source"
import * as express from 'express';

import routes from "./routes";
import 'dotenv/config'

AppDataSource.initialize().then(async () => {
    console.log('Database connected new');
}).catch(error => console.log(error))

// инициализация сервера
const app = express();
app.use(express.json());
app.use('/images', express.static('./src/assets/images/'))

app.use('/', routes)

console.log(express.Router().stack)

app.listen(3001);
