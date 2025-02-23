import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'services', timestamps: true })
export class Service {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  category: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
