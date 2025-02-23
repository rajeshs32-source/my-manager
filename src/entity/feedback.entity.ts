import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ collection: 'feedbacks', timestamps: true })
export class Feedback {
  @Prop({ required: true, ref: 'users' })
  customerId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, ref: 'services' })
  orderId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
