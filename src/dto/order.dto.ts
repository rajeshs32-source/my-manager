import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsDate,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

import mongoose from 'mongoose';
import {
  PaymentMethodEnum,
  ServiceCategoryEnum,
} from 'src/enums/serviceCategory.enum';

class BillDetailDto {
  @IsEnum(ServiceCategoryEnum)
  @IsNotEmpty()
  ServiceCategory: ServiceCategoryEnum;

  @IsString()
  @IsNotEmpty()
  advancePayment: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  paymentdate: Date;

  @IsEnum(PaymentMethodEnum)
  @IsNotEmpty()
  paymentMode: PaymentMethodEnum;
}

class ServiceDto {
  @IsMongoId()
  @IsNotEmpty()
  serviceIds: mongoose.Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  Description: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  customerId: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  vehicleId: mongoose.Schema.Types.ObjectId;

  @IsOptional() // ✅ Makes `orderNumber` optional
  @IsNumber()
  orderNumber?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services: ServiceDto[];

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  orderDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  expectedDeliveryDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillDetailDto)
  billDetails: BillDetailDto[];

  @IsEnum(['pending', 'in-progress', 'completed', 'canceled'])
  status: string;
}

export class UpdateOrderDto {
  @IsMongoId()
  @IsOptional()
  customerId?: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  vehicleId?: mongoose.Schema.Types.ObjectId;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  @IsOptional()
  services?: ServiceDto[];

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  orderDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expectedDeliveryDate?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillDetailDto)
  @IsOptional()
  billDetails?: BillDetailDto[];

  @IsEnum(['pending', 'in-progress', 'completed', 'canceled'])
  @IsOptional()
  status?: string;
}
