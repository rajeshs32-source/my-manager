import { IsString, IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsBoolean()
  @IsNotEmpty()
  insuranceService: boolean;

  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsString()
  @IsNotEmpty()
  licensePlate: string;
}

export class UpdateVehicleDto {
  @IsString()
  make?: string;

  @IsString()
  model?: string;

  @IsNumber()
  year?: number;

  @IsBoolean()
  insuranceService: boolean;

  @IsString()
  ownerId?: string;

  @IsString()
  licensePlate: string;
}
