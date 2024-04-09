import { User } from "../entity/User";

export interface Register extends Omit<User, 'lastname' | 'phone' | 'birthday' | 'id'> {}