import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Param,
  Body,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { UnprocessableEntityException } from '@nestjs/common';
import { VehicleService } from 'src/consumer/vehicle/vehicle.service';
import { GlobalResponseDto } from 'src/dto/global.response.dto';
import { CreateVehicleDto, UpdateVehicleDto } from 'src/dto/vehicle.dto';
import { VehicleValidator } from 'src/validators/vehicleValidator';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly _vehicleService: VehicleService) {}

  // Create a new vehicle
  @Post('create')
  async createVehicle(
    @Res() response: Response,
    @Body() vehicleDto: CreateVehicleDto,
  ) {
    try {
      // Validate the vehicle creation data
      await VehicleValidator.validateVehicleCreation(vehicleDto);

      // Call service to create the vehicle
      const createdVehicle =
        await this._vehicleService.createVehicle(vehicleDto);

      // Return success response
      return response
        .status(HttpStatus.CREATED)
        .json(
          new GlobalResponseDto(
            HttpStatus.CREATED,
            'Vehicle created successfully',
            createdVehicle,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Get()
  async getAllVehicles(
    @Res() response: Response,
    @Query('search') searchValue?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const pageNumber = page ? parseInt(page, 10) : 1;

      const vehicles = await this._vehicleService.getAllVehicles(
        limitNumber,
        pageNumber,
        searchValue,
      );

      return response.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Vehicles retrieved successfully',
        data: vehicles,
        errors: [],
      });
    } catch (error) {
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: error?.message || 'Failed to fetch vehicles',
        errors: [],
      });
    }
  }

  // Update an existing vehicle
  @Put(':id')
  async updateVehicle(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() vehicleDto: UpdateVehicleDto,
  ) {
    try {
      // Validate the vehicle update data
      await VehicleValidator.validateVehicleUpdate(vehicleDto);

      // Call service to update the vehicle
      const updatedVehicle = await this._vehicleService.updateVehicle(
        id,
        vehicleDto,
      );

      // Return success response
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Vehicle updated successfully',
            updatedVehicle,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  // Get a vehicle by ID
  @Get(':id')
  async getVehicle(@Res() response: Response, @Param('id') id: string) {
    try {
      // Call service to get the vehicle
      const vehicle = await this._vehicleService.getVehicleById(id);

      // Return success response
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Vehicle retrieved successfully',
            vehicle,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Vehicle not found',
      );
    }
  }

  // Delete a vehicle by ID
  @Delete(':id')
  async deleteVehicle(@Res() response: Response, @Param('id') id: string) {
    try {
      // Call service to delete the vehicle
      const deletedVehicle = await this._vehicleService.deleteVehicle(id);

      // Return success response
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Vehicle deleted successfully',
            deletedVehicle,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Vehicle not found',
      );
    }
  }
}
