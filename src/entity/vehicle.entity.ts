import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ collection: 'vehicles', timestamps: true })
export class Vehicle {
  @Prop({ required: true, ref: 'users' })
  ownerId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, unique: true })
  licensePlate: string;

  @Prop({ default: false })
  insuranceService: boolean;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
