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
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from 'src/dto/service.dto';
import { ServiceValidator } from 'src/validators/serviceValidator';

@Controller('services')
export class ServiceController {
  constructor(private readonly _serviceService: ServiceService) {}

  @Post('create')
  async createService(
    @Res() response: Response,
    @Body() serviceDto: CreateServiceDto,
  ) {
    try {
      await ServiceValidator.validateServiceCreation(serviceDto);
      const createdService =
        await this._serviceService.createService(serviceDto);
      return response
        .status(HttpStatus.CREATED)
        .json(
          new GlobalResponseDto(
            HttpStatus.CREATED,
            'Service created successfully',
            createdService,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Put(':id')
  async updateService(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() serviceDto: UpdateServiceDto,
  ) {
    try {
      await ServiceValidator.validateUpdateService(serviceDto);
      const updatedService = await this._serviceService.updateService(
        id,
        serviceDto,
      );
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Service updated successfully',
            updatedService,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Get()
  async getAllServices(
    @Res() response: Response,
    @Query('search') searchValue?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const pageNumber = page ? parseInt(page, 10) : 1;

      const services = await this._serviceService.getAllServices(
        limitNumber,
        pageNumber,
        searchValue,
      );
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Services retrieved successfully',
            services,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Failed to fetch services',
      );
    }
  }

  @Get(':id')
  async getService(@Res() response: Response, @Param('id') id: string) {
    try {
      const service = await this._serviceService.getServiceById(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Service retrieved successfully',
            service,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Service not found',
      );
    }
  }

  @Delete(':id')
  async deleteService(@Res() response: Response, @Param('id') id: string) {
    try {
      const deletedService = await this._serviceService.deleteService(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Service deleted successfully',
            deletedService,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Service not found',
      );
    }
  }
}
