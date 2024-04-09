import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    login: string

    @Column({select: false})
    password: string

    @Column({nullable: true})
    phone: string

    @Column()
    firstname: string

    @Column({nullable: true})
    lastname: string

    @Column({nullable: true})
    birthday: string

    @Column({nullable: false, default: '[]'})
    favorites: string

    @Column({nullable: false, default: '[]'})
    cart: string

    @Column({nullable: false, default: 1})
    role: number

}
