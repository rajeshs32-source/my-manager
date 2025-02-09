import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseEntity } from './base.entity';
import { StatusEnum } from 'src/enums/status.enum';

export type UserContextEntity = UserContext & Document;

@Schema({ collection: 'usercontexts', timestamps: true })
export class UserContext extends BaseEntity {
  @Prop({ index: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        name: String,
        city: String,
        date: String,
      },
    ],
    default: [],
  })
  events: {
    name: string;
    city: string;
    date: string;
  }[];

  @Prop({ default: StatusEnum.notVerified })
  status: string;
}

export const UserContextSchema = SchemaFactory.createForClass(UserContext);
