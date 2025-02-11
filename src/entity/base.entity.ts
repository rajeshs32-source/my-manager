import { Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export class BaseEntity extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop()
  updatedBy: mongoose.Schema.Types.ObjectId;
}
