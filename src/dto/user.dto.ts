import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto) // 👈 Necessary for nested validation
  address: AddressDto;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto) // 👈 Ensures nested validation
  @IsOptional() // 👈 Allows address updates to be optional
  address?: AddressDto;
}
