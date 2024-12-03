import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { OrderStatus } from "./enums/OrderStatus"

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    products: string

    @Column()
    clientId: number

    @Column()
    clientPhone: string

    @Column()
    clientName: string

    @Column({
        type: "varchar",
        default: OrderStatus.WAITING
    })
    status: OrderStatus
}
