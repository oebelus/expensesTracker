import express from "express"
import { SavingModel } from "../models/savingModel"

export const savingRouter = express.Router()

savingRouter.get('/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const budgets = await SavingModel.find({ userId: userId })
        res.status(200).json(budgets)
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

savingRouter.post('/addSaving/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        if (userId) {
            const budget = await SavingModel.create({
                amount: req.body.amount,
                name: req.body.name,
                isFull: req.body.isFull,
                remaining: req.body.remaining,
                userId: userId
            } as Saving)

            res.json({
                _id: budget._id,
                amount: budget.amount,
                name: budget.name,
                isFull: budget.isFull,
                remaining: budget.remaining,
                userId: budget.userId
            })
        }
    } catch (err) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

savingRouter.put('/editSaving/:userId/:id', async (req, res) => {
    try {
        const savingId = req.params.id
        const updateSaving: Budget = req.body
        const savingToUpdate = await SavingModel.findOne({_id: savingId})

        if (!savingToUpdate) return res.status(404).json({ error: 'Saving not found' });

        savingToUpdate.remaining = updateSaving.remaining
        savingToUpdate.amount = updateSaving.amount
        savingToUpdate.name = updateSaving.name
        savingToUpdate.isFull = updateSaving.isFull

        await savingToUpdate.save()
        res.json(savingToUpdate)
    } catch (err) { 
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

savingRouter.delete('/deleteSaving/:userId/:id', async (req, res) => {
    try {
        const savingId = req.params.id
        const savingToDelete = await SavingModel.findByIdAndDelete({ _id: savingId })

        if (!savingToDelete) return res.status(404).json({ error: 'Saving not found' });
        res.status(200).json({ message: 'Saving deleted successfully' });
    } catch(err) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})
