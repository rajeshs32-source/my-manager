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
import { OrderService } from 'src/consumer/Order/Order.service';
import { GlobalResponseDto } from 'src/dto/global.response.dto';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/order.dto';
import { OrderValidator } from 'src/validators/orderValidators';

@Controller('orders')
export class OrderController {
  constructor(private readonly _OrderService: OrderService) {}

  // Create a new Order
  @Post('create')
  async createOrder(
    @Res() response: Response,
    @Body() OrderDto: CreateOrderDto,
  ) {
    try {
      // Validate the Order creation data
      await OrderValidator.validateOrderCreation(OrderDto);

      // Call service to create the Order
      const createdOrder = await this._OrderService.createOrder(OrderDto);

      // Return success response
      return response
        .status(HttpStatus.CREATED)
        .json(
          new GlobalResponseDto(
            HttpStatus.CREATED,
            'Order created successfully',
            createdOrder,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Get()
  async getAllOrders(
    @Res() response: Response,
    @Query('search') searchValue?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const pageNumber = page ? parseInt(page, 10) : 1;

      const orders = await this._OrderService.getAllOrders(
        limitNumber,
        pageNumber,
        searchValue,
      );

      return response.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Orders retrieved successfully',
        data: orders,
        errors: [],
      });
    } catch (error) {
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: error?.message || 'Failed to fetch orders',
        errors: [],
      });
    }
  }

  // Update an existing Order
  @Put(':id')
  async updateOrder(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() OrderDto: UpdateOrderDto,
  ) {
    try {
      // Validate the Order update data
      await OrderValidator.validateOrderUpdate(OrderDto);

      // Call service to update the Order
      const updatedOrder = await this._OrderService.updateOrder(id, OrderDto);

      // Return success response
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Order updated successfully',
            updatedOrder,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  // Get an Order by ID
  @Get(':id')
  async getOrder(@Res() response: Response, @Param('id') id: string) {
    try {
      // Call service to get the Order
      const Order = await this._OrderService.getOrderById(id);

      // Return success response
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Order retrieved successfully',
            Order,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Order not found',
      );
    }
  }

  // Delete an Order by ID
  @Delete(':id')
  async deleteOrder(@Res() response: Response, @Param('id') id: string) {
    try {
      // Call service to delete the Order
      const deletedOrder = await this._OrderService.deleteOrder(id);

      // Return success response
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Order deleted successfully',
            deletedOrder,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Order not found',
      );
    }
  }
}
