import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class BaseEntity extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop()
  updatedBy: mongoose.Schema.Types.ObjectId;
}
