import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLabourDto, UpdateLabourDto } from 'src/dto/labour.dto';
import { Labour } from 'src/entity/labour.entity';

@Injectable()
export class LabourService {
  constructor(@InjectModel(Labour.name) private labourModel: Model<Labour>) {}

  async createLabour(createLabourDto: CreateLabourDto): Promise<Labour> {
    const labour = new this.labourModel(createLabourDto);
    return labour.save();
  }

  async getAllLabour(
    limit = 10,
    page = 1,
    searchValue?: string,
  ): Promise<Labour[]> {
    const query: Record<string, any> = {};

    if (searchValue) {
      query.$or = [
        { name: new RegExp(searchValue, 'i') }, // Case-insensitive match for name
        { role: new RegExp(searchValue, 'i') }, // Case-insensitive match for skill
      ];
    }

    return this.labourModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }

  async getLabourById(id: string): Promise<Labour> {
    const labour = await this.labourModel.findById(id).exec();
    if (!labour) throw new NotFoundException(`Labour with ID ${id} not found`);
    return labour;
  }

  async updateLabour(
    id: string,
    updateLabourDto: UpdateLabourDto,
  ): Promise<Labour> {
    const updatedLabour = await this.labourModel
      .findByIdAndUpdate(id, updateLabourDto, { new: true })
      .exec();
    if (!updatedLabour)
      throw new NotFoundException(`Labour with ID ${id} not found`);
    return updatedLabour;
  }

  async deleteLabour(id: string): Promise<Labour> {
    const deletedLabour = await this.labourModel.findByIdAndDelete(id).exec();
    if (!deletedLabour)
      throw new NotFoundException(`Labour with ID ${id} not found`);
    return deletedLabour;
  }
}
