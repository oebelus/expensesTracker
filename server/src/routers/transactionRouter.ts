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
                txType: req.body.txType,
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

transactionRouter.put('/editTransaction/:userId/:id', async (req: Request, res: Response) => {
    try {
        const txId = req.params.id
        const updateTx: Transaction = req.body
        
        const dictionary: Record<string, boolean> = {"true": true, "false": false}

        const txToUpdate = await TransactionModel.findOne({_id: txId})

        if (!txToUpdate) return res.status(404).json({ error: 'Transaction not found' });

        txToUpdate.category = updateTx.category
        txToUpdate.amount = parseFloat(updateTx.amount)
        txToUpdate.name = updateTx.name
        txToUpdate.date = updateTx.date
        txToUpdate.recurring = dictionary[updateTx.recurring]
        txToUpdate.txType = updateTx.txType

        console.log(txToUpdate)
        await txToUpdate.save()
        res.json(txToUpdate)
    } catch (err) { 
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

transactionRouter.delete('/deleteTransaction/:userId/:id', async (req: Request, res: Response) => {
    try {
        const txId = req.params.id
        const txToDelete = await TransactionModel.findByIdAndDelete({ _id: txId })

        if (!txToDelete) return res.status(404).json({ error: 'Transaction not found' });
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch(err) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})
