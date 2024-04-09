import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Product } from "./entity/Product"
import { ConstructorOrder } from "./entity/ConstructorOrder"
import { Order } from "./entity/Order"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Product, ConstructorOrder, Order],
    migrations: [],
    subscribers: [],
})
