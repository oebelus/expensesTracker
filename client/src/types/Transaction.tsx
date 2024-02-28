export type Transaction = {
    _id: string,
    amount: string,
    name?: string,
    date: Date,
    unchangedDate?: Date,
    category: string,
    recurring: boolean,
}