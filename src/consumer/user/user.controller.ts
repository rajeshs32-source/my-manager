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
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { UserValidator } from 'src/validators/userVAlidator';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('create')
  async createUser(@Res() response: Response, @Body() userDto: CreateUserDto) {
    try {
      await UserValidator.validateUserCreation(userDto);
      const createdUser = await this._userService.createUser(userDto);
      return response
        .status(HttpStatus.CREATED)
        .json(
          new GlobalResponseDto(
            HttpStatus.CREATED,
            'User created successfully',
            createdUser,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.response.message || 'Invalid data',
      );
    }
  }

  @Get()
  async getAllUsers(
    @Res() response: Response,
    @Query('search') searchValue?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const pageNumber = page ? parseInt(page, 10) : 1;

      const users = await this._userService.getAllUsers(
        limitNumber,
        pageNumber,
        searchValue,
      );

      return response.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
        errors: [],
      });
    } catch (error) {
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: error?.message || 'Failed to fetch users',
        errors: [],
      });
    }
  }

  @Put(':id')
  async updateUser(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
  ) {
    try {
      await UserValidator.validateUserUpdate(userDto);
      const updatedUser = await this._userService.updateUser(id, userDto);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'User updated successfully',
            updatedUser,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Get(':id')
  async getUser(@Res() response: Response, @Param('id') id: string) {
    try {
      const user = await this._userService.getUserById(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'User retrieved successfully',
            user,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'User not found',
      );
    }
  }

  @Delete(':id')
  async deleteUser(@Res() response: Response, @Param('id') id: string) {
    try {
      const deletedUser = await this._userService.deleteUser(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'User deleted successfully',
            deletedUser,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'User not found',
      );
    }
  }
}
