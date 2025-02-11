import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { StatusEnum } from 'src/enums/status.enum';

export type UserEntity = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User extends BaseEntity {
  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ type: Object })
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
  };

  @Prop()
  accessType: string;

  @Prop()
  termsAndCondChecked: boolean;

  @Prop({ default: StatusEnum.active })
  status: string;

  // @Prop()
  // lastPwdChangedDate: Date;

  // @Prop({ default: '' })
  // city: string;

  // @Prop({ default: null })
  // avatar: string;

  // @Prop({ default: '' })
  // gender: string;

  // @Prop({ default: null })
  // lastlogin: Date;

  // @Prop({ default: false })
  // isGenericCode: boolean;

  // @Prop({ type: Object })
  // mfaVerificationDetails: {
  //   phoneNumber: string;
  //   phoneNumberVerifiedDate: Date;
  // };
}

export const UserSchema = SchemaFactory.createForClass(User);
