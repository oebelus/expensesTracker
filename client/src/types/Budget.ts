export type Budget = {
    createdAt: Date,
    _id: string,
    amount: number,
    name: string,
    isFull: boolean,
    remaining: number,
    recurring: boolean,
    userId: string
}