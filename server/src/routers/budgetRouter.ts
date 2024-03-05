import express from "express"
import { BudgetModel } from "../models/budgetModel"

export const budgetRouter = express.Router()

budgetRouter.get('/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const budgets = await BudgetModel.find({ userId: userId })
        res.status(200).json(budgets)
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

budgetRouter.post('/addBudget/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        if (userId) {
            const budget = await BudgetModel.create({
                amount: req.body.amount,
                name: req.body.name,
                isFull: req.body.isFull,
                remaining: req.body.remaining,
                recurring: req.body.recurring,
                userId: userId
            } as Budget)
            console.log(budget, userId)

            res.json({
                _id: budget._id,
                amount: budget.amount,
                name: budget.name,
                isFull: budget.isFull,
                remaining: budget.remaining,
                recurring: budget.recurring,
                userId: budget.userId
            })
        }
    } catch (err) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

budgetRouter.put('/editBudget/:userId/:id', async (req, res) => {
    try {
        const budgetId = req.params.id
        const updateBudget: Budget = req.body
        const budgetToUpdate = await BudgetModel.findOne({_id: budgetId})

        if (!budgetToUpdate) return res.status(404).json({ error: 'Budget not found' });

        budgetToUpdate.remaining = updateBudget.remaining
        budgetToUpdate.amount = updateBudget.amount
        budgetToUpdate.name = updateBudget.name
        budgetToUpdate.recurring = updateBudget.recurring
        budgetToUpdate.isFull = updateBudget.isFull

        await budgetToUpdate.save()
        res.json(budgetToUpdate)
    } catch (err) { 
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

budgetRouter.delete('/deleteBudget/:userId/:id', async (req, res) => {
    try {
        const budgetId = req.params.id
        const budgetToDelete = await BudgetModel.findByIdAndDelete({ _id: budgetId })

        if (!budgetToDelete) return res.status(404).json({ error: 'Budget not found' });
        res.status(200).json({ message: 'Saving deleted successfully' });
    } catch(err) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})
