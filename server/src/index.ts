import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import session from "express-session"
import { urlencoded } from 'body-parser';
import { userRouter } from './routers/userRouter';
import { transactionRouter } from './routers/transactionRouter';
import { budgetRouter } from './routers/budgetRouter';
import { savingRouter } from './routers/savingRouter';
dotenv.config()

const store = new session.MemoryStore()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/expenses'

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to Mongo")
    })
    .catch(() => {
        console.log("Failed to connect to Mongo")
    })

const app = express()
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

app.use(session({
    secret: process.env.ACCESS_SECRET!,
    cookie: { maxAge: 30000 },
    saveUninitialized: false, // so I don't end up with same sessionId everytime I send a request to the server
    store
}))

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use('../../../client/public', express.static('images'))

app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`)
    next()
})

app.use('/users', userRouter)
app.use('/transactions', transactionRouter)
app.use('/budgets', budgetRouter)
app.use('/savings', savingRouter)

const PORT = 4000

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})