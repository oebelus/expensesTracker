export type Transaction = {
    amount: string,
    name?: string,
    date: Date,
    category: string,
    recurring: boolean,
}