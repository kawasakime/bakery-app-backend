import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

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

}
