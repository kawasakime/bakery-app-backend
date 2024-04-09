     

 import * as bcrypt from 'bcrypt';

 export const Encrypt = {
  cryptPassword: async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    return hash;
  },
  comparePassword: async (password: string, hashPassword: string) => {
    const result = await bcrypt.compare(password, hashPassword);
    
    return result
  }
}
 