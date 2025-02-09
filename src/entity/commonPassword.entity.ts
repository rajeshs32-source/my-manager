import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';

export type CommonPasswordEntity = CommonPassword & Document;

@Schema({ collection: 'commonpasswords', timestamps: true })
export class CommonPassword extends BaseEntity {
  @Prop({ index: true })
  password: string;
}

export const CommonPasswordSchema =
  SchemaFactory.createForClass(CommonPassword);
