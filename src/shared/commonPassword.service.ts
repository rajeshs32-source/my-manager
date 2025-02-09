import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CommonPassword,
  CommonPasswordEntity,
} from 'src/entity/commonPassword.entity';

@Injectable()
export class CommonPasswordService {
  constructor(
    @InjectModel(CommonPassword.name)
    private _commonPasswordDb: Model<CommonPasswordEntity>,
  ) {}

  async commonPasswordCheck(password) {
    const commonPassword = await this._commonPasswordDb.findOne({ password });
    if (commonPassword) {
      throw new BadRequestException(
        'It is a common password, please use something unique',
      );
    }
  }
}
