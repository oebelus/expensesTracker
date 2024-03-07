import express, {Request, Response} from "express"
import { User, UserModel } from "../models/userModel";
import bcrypt from "bcrypt"
import * as utils from "../utils";
import multer from "multer";
import path from 'path'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../../../client/public/profile'))
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
})
var upload = multer({ storage: storage })

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
                token: utils.generateToken(user),
                password: user.password,
                image: user.image
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
                token: utils.generateToken(user),
                image: user.image
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
        password: bcrypt.hashSync(req.body.password, salt),
        imane: req.body.image
    } as User)

    res.json({
        _id: user._id,
        firstName: user.firstName,
        familyName: user.familyName,
        email: user.email,
        token: utils.generateToken(user),
        password: bcrypt.hashSync(req.body.password, salt),
        Image: user.image
    })
})

userRouter.post('/image', upload.single('pfp'), async (req, res) => {
    console.log(JSON.stringify(req.file))
    const response = req.file?.originalname
    return res.send(req.file?.filename)
})

userRouter.put('/image/:userId', upload.single('pfp'), async (req, res) => {
    console.log(JSON.stringify(req.file))
    try {
        const userId = req.params.userId
        const user = await UserModel.findById(userId)
        if (!user) return res.status(404).send("User Not Found")
        //console.log(JSON.stringify(req.file))
        user.image = req.file?.filename
        await user.save()
        return res.send(req.file?.filename)
    }
    catch (err) {
        res.status(500).send("Internal Server Error")
    }
})