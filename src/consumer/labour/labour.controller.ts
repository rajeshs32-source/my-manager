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
import { LabourService } from './labour.service';
import { CreateLabourDto, UpdateLabourDto } from 'src/dto/labour.dto';
import { LabourValidator } from 'src/validators/labourValidator';

@Controller('labours')
export class LabourController {
  constructor(private readonly _labourService: LabourService) {}

  @Post('create')
  async createLabour(
    @Res() response: Response,
    @Body() labourDto: CreateLabourDto,
  ) {
    try {
      await LabourValidator.validateLabourCreation(labourDto);
      const createdLabour = await this._labourService.createLabour(labourDto);
      return response
        .status(HttpStatus.CREATED)
        .json(
          new GlobalResponseDto(
            HttpStatus.CREATED,
            'Labour created successfully',
            createdLabour,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Get()
  async getAllLabour(
    @Res() response: Response,
    @Query('search') searchValue?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const pageNumber = page ? parseInt(page, 10) : 1;

      const labours = await this._labourService.getAllLabour(
        limitNumber,
        pageNumber,
        searchValue,
      );

      return response.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Labours retrieved successfully',
        data: labours,
        errors: [],
      });
    } catch (error) {
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: error?.message || 'Failed to fetch labours',
        errors: [],
      });
    }
  }

  @Put(':id')
  async updateLabour(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() labourDto: UpdateLabourDto,
  ) {
    try {
      await LabourValidator.validateLabourUpdate(labourDto);
      const updatedLabour = await this._labourService.updateLabour(
        id,
        labourDto,
      );
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Labour updated successfully',
            updatedLabour,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Get(':id')
  async getLabour(@Res() response: Response, @Param('id') id: string) {
    try {
      const labour = await this._labourService.getLabourById(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Labour retrieved successfully',
            labour,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Labour not found',
      );
    }
  }

  @Delete(':id')
  async deleteLabour(@Res() response: Response, @Param('id') id: string) {
    try {
      const deletedLabour = await this._labourService.deleteLabour(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Labour deleted successfully',
            deletedLabour,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Labour not found',
      );
    }
  }
}
