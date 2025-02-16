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
import { ApiProperty } from '@nestjs/swagger';
import { AccessTypeEnum } from 'src/enums/accessType.enum';
import { StatusEnum } from 'src/enums/status.enum';

export class AuthRequestDto {
  username: string;
  password: string;
}

export class AuthDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'SecurePass123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'User phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    example: 'admin',
    description: 'Access type (admin or superAdmin)',
  })
  @IsEnum(AccessTypeEnum)
  @IsNotEmpty()
  accessType: AccessTypeEnum;

  @ApiProperty({
    example: 'Not Verified',
    description: 'User account status',
    default: StatusEnum.notVerified,
  })
  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;

  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'Profile avatar',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    example: ['manage-users'],
    description: 'Roles assigned to the user',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  roles?: string[];

  @ApiProperty({
    example: ['edit-products'],
    description: 'User permissions',
    required: false,
  })
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
