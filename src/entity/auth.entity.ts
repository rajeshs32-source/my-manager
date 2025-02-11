import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AccessTypeEnum } from 'src/enums/accessType.enum';
import { StatusEnum } from 'src/enums/status.enum';

export type AuthEntity = Auth & Document;

@Schema({ collection: 'auths', timestamps: true })
export class Auth {
  @Prop()
  fullName: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ default: '+1' })
  countryCode: string;

  @Prop()
  phoneNumber: string;

  @Prop({
    required: true,
    enum: [AccessTypeEnum.admin, AccessTypeEnum.superAdmin],
  })
  accessType: string;

  @Prop({
    default: StatusEnum.notVerified,
    enum: [
      StatusEnum.active,
      StatusEnum.notVerified,
      StatusEnum.inActive,
      StatusEnum.deleted,
    ],
  })
  status: string;

  @Prop({ length: 6, index: true, sparse: true })
  signupToken: string;

  @Prop()
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop()
  updatedBy: mongoose.Schema.Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  avatar: string;

  @Prop({ default: false })
  corporateAccess: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  corporateId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: [], type: mongoose.Schema.Types.Array })
  customers: [
    {
      id: mongoose.Schema.Types.ObjectId;
      access: Array<string>;
      status: string;
    },
  ];
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

AuthSchema.index({ username: 1, accessType: 1 }, { unique: true });
