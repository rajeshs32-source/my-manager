import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateLabourDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  expertise: string;

  @IsNumber()
  @IsNotEmpty()
  hourlyRate: number;
}

export class UpdateLabourDto {
  @IsString()
  name?: string;

  @IsString()
  expertise?: string;

  @IsNumber()
  hourlyRate?: number;
}
