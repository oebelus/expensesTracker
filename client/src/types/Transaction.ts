export type Transaction = {
    _id: string,
    amount: number,
    name: string,
    date: Date,
    unchangedDate?: Date,
    category: string,
    recurring: boolean,
    txType: string
}