import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as jsonwebtoken from 'jsonwebtoken';
import { jwtSecretKey } from 'src/config';
import { Auth, AuthEntity } from 'src/entity/auth.entity';
import { AuthRequestDto, SignupRequestDto } from 'src/dto/adminRequest.dto';
import { UserService } from 'src/shared/user.service';
import { CommonPasswordService } from 'src/shared/commonPassword.service';
import { UserContextService } from 'src/shared/userContext.service';
import * as bcrypt from 'bcrypt';
import { StatusEnum } from 'src/enums/status.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private _authDb: Model<AuthEntity>,
    private _userService: UserService,
    private _commonPasswordService: CommonPasswordService,
    private _userContextService: UserContextService,
  ) {}
  saltRounds = 10;
  async login(authRequestDto: AuthRequestDto) {
    const { username, password } = authRequestDto;
    const findUser = await this._authDb.findOne({ username });
    const userContextId = await this._userContextService.getUserContext(
      findUser._id as unknown as mongoose.Schema.Types.ObjectId,
    );
    const userData = {
      findUser,
      userContextId: userContextId._id,
    };
    if (!bcrypt.compareSync(password, findUser.password) || !findUser) {
      throw new BadRequestException(
        'Please enter a valid Member ID and Password',
      );
    }
    return this.generateToken(userData);
  }

  async signup(signupRequestDto: SignupRequestDto) {
    const {
      username,
      password,
      firstName,
      lastName,
      termsAndCondChecked,
      addressline1,
      addressline2,
      city,
      postalCode,
      accessType,
    } = signupRequestDto;

    await this._userService.usernameCheck(username);
    await this._commonPasswordService.commonPasswordCheck(password);
    const result = await new this._authDb({
      username,
      password: bcrypt.hashSync(password, this.saltRounds),
      firstName,
      lastName,
      'address.addressline1': addressline1,
      'address.addressline2': addressline2,
      'address.city': city,
      'address.postalCode': postalCode,
      termsAndCondChecked,
      status: 'Active',
      accessType,
    }).save();
    const userId = result._id as unknown as mongoose.Schema.Types.ObjectId;
    await this._userContextService.updateStatus(userId, {
      status: StatusEnum.active,
    });
    return result;
  }

  async generateToken(userData) {
    const jwtSecret = jwtSecretKey.secretKey;
    const token = jsonwebtoken.sign({ user: userData }, jwtSecret);
    const sendToken = {
      access_token: token,
      token_type: 'Bearer',
    };
    return sendToken;
  }
}
