import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { StatusEnum } from 'src/enums/status.enum';
import { RoleEnum } from 'src/enums/role.enum';

export type UserEntity = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User extends BaseEntity {
  @Prop({ default: '' })
  name: string;

  @Prop({ type: Object })
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
  };

  @Prop({ default: RoleEnum.customer })
  role: string;

  @Prop()
  phone: string;

  @Prop({ default: StatusEnum.active })
  status: string;

  @Prop({ default: null })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
