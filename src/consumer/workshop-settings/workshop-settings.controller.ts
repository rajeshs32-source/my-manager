import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GlobalResponseDto } from 'src/dto/global.response.dto';
import { Response } from 'express';
import { WorkshopSettingsService } from './workshop-settings.service';
import {
  CreateWorkshopSettingsDto,
  UpdateWorkshopSettingsDto,
} from 'src/dto/workshopSetting.dto';
import { WorkshopSettingsValidator } from 'src/validators/workshopSettingValidator';

@Controller('workshop-settings')
export class WorkshopSettingsController {
  constructor(
    private readonly _workshopSettingsService: WorkshopSettingsService,
  ) {}

  @Post('create')
  async createSettings(
    @Res() response: Response,
    @Body() settingsDto: CreateWorkshopSettingsDto,
  ) {
    try {
      await WorkshopSettingsValidator.validateCreateSettings(settingsDto);
      const createdSettings =
        await this._workshopSettingsService.createSettings(settingsDto);
      return response
        .status(HttpStatus.CREATED)
        .json(
          new GlobalResponseDto(
            HttpStatus.CREATED,
            'Settings created successfully',
            createdSettings,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Get()
  async getAllWorkshopSettings(
    @Res() response: Response,
    @Query('search') searchValue?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const pageNumber = page ? parseInt(page, 10) : 1;

      const settings =
        await this._workshopSettingsService.getAllWorkshopSettings(
          limitNumber,
          pageNumber,
          searchValue,
        );

      return response.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Workshop settings retrieved successfully',
        data: settings,
        errors: [],
      });
    } catch (error) {
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: error?.message || 'Failed to fetch workshop settings',
        errors: [],
      });
    }
  }

  @Put(':id')
  async updateSettings(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() settingsDto: UpdateWorkshopSettingsDto,
  ) {
    try {
      await WorkshopSettingsValidator.validateUpdateSettings(settingsDto);
      const updatedSettings =
        await this._workshopSettingsService.updateSettings(id, settingsDto);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Settings updated successfully',
            updatedSettings,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Get(':id')
  async getSettings(@Res() response: Response, @Param('id') id: string) {
    try {
      const settings = await this._workshopSettingsService.getSettingsById(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Settings retrieved successfully',
            settings,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Settings not found',
      );
    }
  }

  @Delete(':id')
  async deleteSettings(@Res() response: Response, @Param('id') id: string) {
    try {
      const deletedSettings =
        await this._workshopSettingsService.deleteSettings(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Settings deleted successfully',
            deletedSettings,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Settings not found',
      );
    }
  }
}
