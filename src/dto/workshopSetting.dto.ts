import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWorkshopSettingsDto {
  @IsString()
  @IsNotEmpty()
  settingName: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdateWorkshopSettingsDto {
  @IsString()
  settingName?: string;

  @IsString()
  value?: string;
}
