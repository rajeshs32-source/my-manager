import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSalaryDto, UpdateSalaryDto } from 'src/dto/salary.dto';
import { Salary } from 'src/entity/salary.entity';
import { User } from 'src/entity/user.entity';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(Salary.name) private salaryModel: Model<Salary>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createSalary(createSalaryDto: CreateSalaryDto): Promise<Salary> {
    const salary = new this.salaryModel(createSalaryDto);
    return salary.save();
  }

  async getAllSalaries(
    limit = 10,
    page = 1,
    searchValue?: string,
  ): Promise<Salary[]> {
    const query: Record<string, any> = {};

    if (searchValue) {
      const searchRegex = new RegExp(searchValue, 'i'); // Case-insensitive regex search

      // Find user by name
      const users = await this.userModel.find({ name: searchRegex });

      const userIds = users.map((user) => user._id); // Extract user IDs

      // Find labours where customerId matches any of the found userIds
      const salaries = await this.salaryModel.find({
        customerId: { $in: userIds },
      });

      const salaryIds = salaries.map((labour) => labour._id); // Extract labour IDs

      // Check if searchValue is a valid date
      const dateSearch = !isNaN(Date.parse(searchValue))
        ? new Date(searchValue)
        : undefined;

      query.$or = [
        { month: searchRegex }, // Match month
        { year: searchRegex }, // Match year
        ...(dateSearch ? [{ date: dateSearch }] : []), // Match exact date if valid
        ...(salaryIds.length ? [{ labourId: { $in: salaryIds } }] : []), // Match salaries for labours found
      ].filter((condition) => Object.values(condition)[0] !== undefined); // Remove undefined values
    }

    return this.salaryModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }

  async getSalaryById(id: string): Promise<Salary> {
    const salary = await this.salaryModel.findById(id).exec();
    if (!salary) throw new NotFoundException(`Salary with ID ${id} not found`);
    return salary;
  }

  async updateSalary(
    id: string,
    updateSalaryDto: UpdateSalaryDto,
  ): Promise<Salary> {
    const updatedSalary = await this.salaryModel
      .findByIdAndUpdate(id, updateSalaryDto, { new: true })
      .exec();
    if (!updatedSalary)
      throw new NotFoundException(`Salary with ID ${id} not found`);
    return updatedSalary;
  }

  async deleteSalary(id: string): Promise<Salary> {
    const deletedSalary = await this.salaryModel.findByIdAndDelete(id).exec();
    if (!deletedSalary)
      throw new NotFoundException(`Salary with ID ${id} not found`);
    return deletedSalary;
  }
}
