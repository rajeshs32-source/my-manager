import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @IsNotEmpty()
  rating: number; // 1 to 5 rating scale
}

export class UpdateFeedbackDto {
  @IsString()
  feedbackText?: string;

  @IsNumber()
  rating?: number;
}
