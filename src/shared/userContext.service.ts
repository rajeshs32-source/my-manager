import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Schema } from 'mongoose';
import { UserContext, UserContextEntity } from 'src/entity/userContext.entity';

@Injectable()
export class UserContextService {
  constructor(
    @InjectModel(UserContext.name)
    private _userContextDb: Model<UserContextEntity>,
  ) {}

  async findUserContext(userId: Schema.Types.ObjectId) {
    const userData = await this._userContextDb.findOne({ userId: userId });
    return userData;
  }

  async getUserContext(userId: Schema.Types.ObjectId) {
    return await this._userContextDb.findOne({ userId });
  }

  async updateStatus(userId: mongoose.Schema.Types.ObjectId, obj: any) {
    const options = { upsert: true, setDefaultsOnInsert: true, new: true };
    await this._userContextDb.findOneAndUpdate({ userId }, obj, options);
  }

  async eventUpdate(userId: mongoose.Schema.Types.ObjectId, obj: any) {
    const options = { upsert: true, setDefaultsOnInsert: true, new: true };
    await this._userContextDb.find({
      userId,
      events: {
        $elemMatch: {
          name: obj.name,
          city: obj.city,
          date: obj.date,
        },
      },
    });
    await this._userContextDb.findOneAndUpdate(
      {
        userId,
        events: {
          $elemMatch: {
            name: obj.name,
            city: obj.city,
            date: obj.date,
          },
        },
      },
      {
        $push: {
          events: {
            name: obj.name,
            city: obj.city,
            date: obj.date,
          },
        },
      },
      options,
    );
  }
}
