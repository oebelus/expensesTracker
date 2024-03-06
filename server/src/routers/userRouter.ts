import express, {Request, Response} from "express"
import { UserModel } from "../models/userModel";
import bcrypt from "bcrypt"
import { generateToken } from "../utils";

export const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response) => {
    try { 
        const users = await UserModel.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

userRouter.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await UserModel.findOne({_id: userId})
        if (user) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                familyName: user.familyName,
                email: user.email,
                token: generateToken(user)
            } as User)
        }
    } catch (error) { 
        res.status(404).json({ error: "User Not Found" })
    }
})

userRouter.post("/login", async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email })

    if (user) {
        if (req.body.password === user.password) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                familyName: user.familyName,
                email: user.email,
                token: generateToken(user)
            })
            return
        }
        res.status(401).json({ message: "Invalid Email or Password" })
        return
    }
    res.status(404).json({ message: "User Doesn't Exist" })
})

userRouter.post("/signup", async (req: Request, res: Response) => {
    const salt = bcrypt.genSaltSync(10);
    const user = await UserModel.create({
        firstName: req.body.firstName,
        familyName: req.body.familyName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt)
    } as User)

    res.json({
        _id: user._id,
        firstName: user.firstName,
        familyName: user.familyName,
        email: user.email,
        token: generateToken(user),
        password: bcrypt.hashSync(req.body.password, salt)
    })
})