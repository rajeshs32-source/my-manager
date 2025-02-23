import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceDto, UpdateServiceDto } from 'src/dto/service.dto';
import { Service } from 'src/entity/service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<Service>,
  ) {}

  async createService(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = new this.serviceModel(createServiceDto);
    return service.save();
  }
  async getAllServices(
    // Single search input from the frontend
    limit = 10,
    page = 1,
    searchValue?: string,
  ): Promise<Service[]> {
    const query: Record<string, any> = {};

    if (searchValue) {
      query.$or = [
        { category: searchValue }, // Exact match for category
        { name: new RegExp(searchValue, 'i') }, // Case-insensitive partial match for name
      ];
    }

    return this.serviceModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }

  async getServiceById(id: string): Promise<Service> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service)
      throw new NotFoundException(`Service with ID ${id} not found`);
    return service;
  }

  async updateService(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const updatedService = await this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, { new: true })
      .exec();
    if (!updatedService)
      throw new NotFoundException(`Service with ID ${id} not found`);
    return updatedService;
  }

  async deleteService(id: string): Promise<Service> {
    const deletedService = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!deletedService)
      throw new NotFoundException(`Service with ID ${id} not found`);
    return deletedService;
  }
}
