import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto, UpdateVehicleDto } from 'src/dto/vehicle.dto';
import { User } from 'src/entity/user.entity';
import { Vehicle } from 'src/entity/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createVehicle(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = new this.vehicleModel(createVehicleDto);
    return vehicle.save();
  }

  async getAllVehicles(
    limit = 10,
    page = 1,
    searchValue?: string,
  ): Promise<Vehicle[]> {
    const query: Record<string, any> = {};

    if (searchValue) {
      const searchRegex = new RegExp(searchValue, 'i'); // Case-insensitive regex search

      // Find users by name or phone number
      const users = await this.userModel.find({
        $or: [{ name: searchRegex }, { phone: searchRegex }],
      });

      const userIds = users.map((user) => user._id); // Extract user IDs

      query.$or = [
        { make: searchValue }, // Exact match for vehicle make
        { model: searchRegex }, // Case-insensitive partial match for model
        ...(userIds.length ? [{ ownerId: { $in: userIds } }] : []), // Match vehicles by customerId
      ];
    }

    return this.vehicleModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle)
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    return vehicle;
  }

  async updateVehicle(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const updatedVehicle = await this.vehicleModel
      .findByIdAndUpdate(id, updateVehicleDto, { new: true })
      .exec();
    if (!updatedVehicle)
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    return updatedVehicle;
  }

  async deleteVehicle(id: string): Promise<Vehicle> {
    const deletedVehicle = await this.vehicleModel.findByIdAndDelete(id).exec();
    if (!deletedVehicle)
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    return deletedVehicle;
  }
}
