import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/order.dto';
import { Order } from 'src/entity/order.entity';
import { User } from 'src/entity/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const Order = new this.OrderModel(createOrderDto);
    return Order.save();
  }

  async getAllOrders(
    limit = 10,
    page = 1,
    searchValue?: string,
  ): Promise<Order[]> {
    const query: Record<string, any> = {};

    if (searchValue) {
      const searchRegex = new RegExp(searchValue, 'i'); // Case-insensitive regex search

      // Check if searchValue is a valid number or date
      const orderNumberSearch = isNaN(Number(searchValue))
        ? undefined
        : Number(searchValue);
      const orderDateSearch = !isNaN(Date.parse(searchValue))
        ? new Date(searchValue)
        : undefined;

      // Find user by name or phone number
      const users = await this.userModel.find({
        $or: [{ name: searchRegex }, { phone: searchRegex }],
      });

      const userIds = users.map((user) => user._id); // Extract user IDs

      query.$or = [
        { orderNumber: orderNumberSearch }, // Exact match for orderNumber
        { status: searchRegex }, // Case-insensitive match for status
        { orderDate: orderDateSearch }, // Exact match for date
        ...(userIds.length ? [{ customerId: { $in: userIds } }] : []), // If users found, match orders with their IDs
      ].filter((condition) => Object.values(condition)[0] !== undefined); // Remove undefined values
    }

    return this.OrderModel.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }

  async getOrderById(id: string): Promise<Order> {
    const Order = await this.OrderModel.findById(id).exec();
    if (!Order) throw new NotFoundException(`Order with ID ${id} not found`);
    return Order;
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const updatedOrder = await this.OrderModel.findByIdAndUpdate(
      id,
      updateOrderDto,
      { new: true },
    ).exec();
    if (!updatedOrder)
      throw new NotFoundException(`Order with ID ${id} not found`);
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<Order> {
    const deletedOrder = await this.OrderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder)
      throw new NotFoundException(`Order with ID ${id} not found`);
    return deletedOrder;
  }
}
