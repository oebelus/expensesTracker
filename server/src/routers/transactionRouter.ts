import express, {Request, Response} from "express"
import { TransactionModel } from "../models/transactionModel";

export const transactionRouter = express.Router();

transactionRouter.get('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const transactions = await TransactionModel.find({userId: userId})
        res.status(200).json(transactions)
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

transactionRouter.post('/AddTransaction/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId
    try {
        if (userId) {
            const transaction = await TransactionModel.create({
                amount: req.body.amount,
                category: req.body.category,
                name: req.body.name,
                date: new Date(req.body.date),
                recurring: req.body.recurring,
                userId: userId
            } as Transaction)
        
            res.json({
                _id: transaction._id,
                amount: transaction.amount,
                category: transaction.category,
                name: transaction.name,
                date: transaction.date,
                recurring: transaction.recurring,
                userId: userId
            })
        }
    } catch (error) {
        res.send(error)
    }
})