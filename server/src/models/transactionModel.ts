import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";
import { User } from "./userModel";

@modelOptions({ schemaOptions: {timestamps: true} })

export class Transaction {
    public _id?: string

    @prop({ required: true})
    public amount!: number

    @prop({ required: true})
    public category!: string

    @prop()
    public name?: string

    @prop({ required: true})
    public date!: Date

    @prop({ required: true, default: false})
    public recurring!: boolean

    @prop({ required: true })
    public txType!: string

    @prop()
    public userId?: string
}

export const TransactionModel = getModelForClass(Transaction)