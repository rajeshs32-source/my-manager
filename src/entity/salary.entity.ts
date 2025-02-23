import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema({ collection: 'salaries', timestamps: true })
export class Salary {
  @Prop({ required: true, ref: 'labours' })
  labourId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, ref: 'users' })
  customerId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  month: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  paidDate: Date;
}

export const SalarySchema = SchemaFactory.createForClass(Salary);
