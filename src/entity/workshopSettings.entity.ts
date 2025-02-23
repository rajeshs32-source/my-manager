import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WorkshopSettingsDocument = WorkshopSettings & Document;

@Schema({ collection: 'workshop_settings', timestamps: true })
export class WorkshopSettings {
  @Prop({ required: true })
  workshopName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  openingHours: string; // e.g., "Mon-Fri 9:00 AM - 6:00 PM"

  @Prop({ required: true, default: true })
  isOpen: boolean;

  @Prop()
  holidayList: string[]; // List of holidays when the workshop is closed
}

export const WorkshopSettingsSchema =
  SchemaFactory.createForClass(WorkshopSettings);
