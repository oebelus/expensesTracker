import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: {timestamps: true} })

export class Budget {
    public _id?: string

    @prop({ required: true})
    public amount!: number

    @prop({ required: true})
    public name!: string

    @prop({ required: true, default: false })
    public isFull!: boolean

    @prop({ required: true})
    public remaining!: number

    @prop({ required: true, default: false})
    public recurring!: boolean

    @prop()
    public userId?: string
}

export const BudgetModel = getModelForClass(Budget)