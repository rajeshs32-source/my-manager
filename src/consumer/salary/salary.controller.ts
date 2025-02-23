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
import { SalaryService } from './salary.service';
import { CreateSalaryDto, UpdateSalaryDto } from 'src/dto/salary.dto';
import { SalaryValidator } from 'src/validators/salaryValidator';

@Controller('salaries')
export class SalaryController {
  constructor(private readonly _salaryService: SalaryService) {}

  @Post('create')
  async createSalary(
    @Res() response: Response,
    @Body() salaryDto: CreateSalaryDto,
  ) {
    try {
      await SalaryValidator.validateSalaryCreation(salaryDto);
      const createdSalary = await this._salaryService.createSalary(salaryDto);
      return response
        .status(HttpStatus.CREATED)
        .json(
          new GlobalResponseDto(
            HttpStatus.CREATED,
            'Salary created successfully',
            createdSalary,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Get()
  async getAllSalaries(
    @Res() response: Response,
    @Query('search') searchValue?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const pageNumber = page ? parseInt(page, 10) : 1;

      const salaries = await this._salaryService.getAllSalaries(
        limitNumber,
        pageNumber,
        searchValue,
      );

      return response.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Salaries retrieved successfully',
        data: salaries,
        errors: [],
      });
    } catch (error) {
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: error?.message || 'Failed to fetch salaries',
        errors: [],
      });
    }
  }

  @Put(':id')
  async updateSalary(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() salaryDto: UpdateSalaryDto,
  ) {
    try {
      await SalaryValidator.validateSalaryUpdate(salaryDto);
      const updatedSalary = await this._salaryService.updateSalary(
        id,
        salaryDto,
      );
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Salary updated successfully',
            updatedSalary,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Get(':id')
  async getSalary(@Res() response: Response, @Param('id') id: string) {
    try {
      const salary = await this._salaryService.getSalaryById(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Salary retrieved successfully',
            salary,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Salary not found',
      );
    }
  }

  @Delete(':id')
  async deleteSalary(@Res() response: Response, @Param('id') id: string) {
    try {
      const deletedSalary = await this._salaryService.deleteSalary(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Salary deleted successfully',
            deletedSalary,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Salary not found',
      );
    }
  }
}
