import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async getAllUsers(
    limit = 10,
    page = 1,
    searchValue?: string,
  ): Promise<User[]> {
    const query: Record<string, any> = {};

    if (searchValue) {
      query.$or = [
        { name: new RegExp(searchValue, 'i') }, // Case-insensitive match for name
        { role: new RegExp(searchValue, 'i') }, // Case-insensitive match for role
        { phone: new RegExp(searchValue, 'i') },
      ];
    }

    return this.userModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser)
      throw new NotFoundException(`User with ID ${id} not found`);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser)
      throw new NotFoundException(`User with ID ${id} not found`);
    return deletedUser;
  }
}
