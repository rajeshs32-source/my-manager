import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccessTypeEnum } from 'src/enums/accessType.enum';
import { StatusEnum } from 'src/enums/status.enum';
import { BaseEntity } from './base.entity';

export type AuthEntity = Auth & Document;

@Schema({ collection: 'auths', timestamps: true })
export class Auth extends BaseEntity {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

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

  @Prop()
  avatar: string;

  @Prop({ default: [], type: [String] })
  roles: string[]; // e.g., ["manage-users", "edit-products"]

  @Prop({ default: [], type: [String] })
  permissions: string[]; // Fine-grained control over access
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

AuthSchema.index({ username: 1, accessType: 1 }, { unique: true });
