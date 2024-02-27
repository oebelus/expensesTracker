import { User } from "./models/userModel"
import jwt from 'jsonwebtoken';

export const generateToken = (user: User) => {
    return jwt.sign(
        {
            _id: user._id,
            firstName: user.firstName,
            familyName: user.familyName,
            email: user.email
        },
        process.env.JWT_SECRET || 'sdSDFSF546516àééééèè-+',
        {
            expiresIn: '30d'
        }
    )
}