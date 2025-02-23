import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document, Model } from 'mongoose';
import {
  PaymentMethodEnum,
  ServiceCategoryEnum,
} from 'src/enums/serviceCategory.enum';

class BillDetail {
  @Prop({ type: String, enum: ServiceCategoryEnum, required: true })
  ServiceCategory: ServiceCategoryEnum;

  @Prop({ required: true })
  advancePayment: string;

  @Prop({ type: Date, required: true })
  paymentdate: Date;

  @Prop({ type: String, enum: PaymentMethodEnum, required: true })
  paymentMode: PaymentMethodEnum;
}

@Schema({ collection: 'orders', timestamps: true })
export class Order extends Document {
  @Prop({ required: true, ref: 'users' })
  customerId: mongoose.Schema.Types.ObjectId;

  @Prop({ unique: true, sparse: true }) // Ensure uniqueness
  orderNumber?: number;

  @Prop({ required: true, ref: 'vehicles' })
  vehicleId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: Object, ref: 'services' })
  services: {
    serviceIds: mongoose.Schema.Types.ObjectId;
    Description: string;
    image: string;
  }[];

  @Prop({ required: true })
  orderDate: Date;

  @Prop({ required: true })
  expectedDeliveryDate: Date;

  @Prop({ type: [BillDetail], required: true })
  billDetails: BillDetail[];

  @Prop({
    enum: ['pending', 'in-progress', 'completed', 'canceled'],
    default: 'pending',
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre<Order>('save', async function (next) {
  if (!this.orderNumber) {
    const OrderModel = this.constructor as Model<Order>; // Explicitly cast constructor as Mongoose model
    const lastOrder = await OrderModel.findOne()
      .sort({ orderNumber: -1 })
      .exec();

    this.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1000; // Start from 1000 if no orders exist
  }
  next();
});
