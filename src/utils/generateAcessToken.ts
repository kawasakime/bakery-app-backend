import * as jwt from 'jsonwebtoken';

export default (login: string) => {
    return jwt.sign({ login }, process.env.TOKEN_SECRET, { expiresIn: '48h' });  
}