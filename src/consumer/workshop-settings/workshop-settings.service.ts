import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateWorkshopSettingsDto,
  UpdateWorkshopSettingsDto,
} from 'src/dto/workshopSetting.dto';
import { WorkshopSettings } from 'src/entity/workshopSettings.entity';

@Injectable()
export class WorkshopSettingsService {
  constructor(
    @InjectModel(WorkshopSettings.name)
    private workshopSettingsModel: Model<WorkshopSettings>,
  ) {}

  async createSettings(
    createWorkshopSettingsDto: CreateWorkshopSettingsDto,
  ): Promise<WorkshopSettings> {
    const settings = new this.workshopSettingsModel(createWorkshopSettingsDto);
    return settings.save();
  }

  async getAllWorkshopSettings(
    limit = 10,
    page = 1,
    searchValue?: string,
  ): Promise<WorkshopSettings[]> {
    const query: Record<string, any> = {};

    if (searchValue) {
      query.$or = [
        { settingName: new RegExp(searchValue, 'i') }, // Case-insensitive match for setting name
        { value: new RegExp(searchValue, 'i') }, // Case-insensitive match for value
      ];
    }

    return this.workshopSettingsModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }

  async getSettingsById(id: string): Promise<WorkshopSettings> {
    const settings = await this.workshopSettingsModel.findById(id).exec();
    if (!settings)
      throw new NotFoundException(`Settings with ID ${id} not found`);
    return settings;
  }

  async updateSettings(
    id: string,
    updateWorkshopSettingsDto: UpdateWorkshopSettingsDto,
  ): Promise<WorkshopSettings> {
    const updatedSettings = await this.workshopSettingsModel
      .findByIdAndUpdate(id, updateWorkshopSettingsDto, { new: true })
      .exec();
    if (!updatedSettings)
      throw new NotFoundException(`Settings with ID ${id} not found`);
    return updatedSettings;
  }

  async deleteSettings(id: string): Promise<WorkshopSettings> {
    const deletedSettings = await this.workshopSettingsModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedSettings)
      throw new NotFoundException(`Settings with ID ${id} not found`);
    return deletedSettings;
  }
}
