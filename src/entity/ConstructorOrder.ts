import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class ConstructorOrder {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    clientId: number

    @Column()
    clientPhone: string

    @Column()
    clientName: string

    @Column()
    params: string

}
