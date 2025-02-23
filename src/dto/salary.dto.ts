import { IsString, IsNumber, IsNotEmpty, IsDate } from 'class-validator';

export class CreateSalaryDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDate()
  @IsNotEmpty()
  paymentDate: Date;

  @IsString()
  @IsNotEmpty()
  month: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;
}

export class UpdateSalaryDto {
  @IsString()
  employeeId?: string;

  @IsNumber()
  amount?: number;

  @IsDate()
  paymentDate?: Date;

  @IsString()
  month?: string;

  @IsNumber()
  year?: number;
}
