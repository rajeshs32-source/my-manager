import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ collection: 'labours', timestamps: true })
export class Labour {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  dailyWage: number;
}

export const LabourSchema = SchemaFactory.createForClass(Labour);
