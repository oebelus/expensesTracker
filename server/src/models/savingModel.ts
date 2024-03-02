import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: {timestamps: true} })

export class Saving {
    public _id?: string

    @prop({ required: true})
    public amount!: number

    @prop({ required: true})
    public name!: string

    @prop({ required: true, default: false })
    public isFull!: boolean

    @prop({ required: true})
    public remaining!: number

    @prop()
    public userId?: string
}

export const SavingModel = getModelForClass(Saving)