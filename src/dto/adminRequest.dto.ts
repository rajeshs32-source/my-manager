import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { AccessTypeEnum } from 'src/enums/accessType.enum';
import { StatusEnum } from 'src/enums/status.enum';

export class AuthRequestDto {
  username: string;
  password: string;
}

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsEnum(AccessTypeEnum)
  @IsNotEmpty()
  accessType: AccessTypeEnum;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  roles?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  permissions?: string[];
}

export class EventDetailsDto {
  name: string;
  date: string;
  city: string;
}
