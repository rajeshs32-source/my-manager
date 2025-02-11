import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
// import jwtDecode from 'jwt-decode';
import { Response, NextFunction } from 'express';
import { Model, Schema } from 'mongoose';
import { GlobalResponseDto } from 'src/dto/global.response.dto';
import { StatusEnum } from 'src/enums/status.enum';
import { Auth, AuthEntity } from 'src/entity/auth.entity';
import { jwtSecretKey } from 'src/config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const jwtDecode = require('jwt-decode');
@Injectable()
export class VerifyAdminAuthTokenMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Auth.name)
    private _userDb: Model<AuthEntity>,
  ) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const urls = ['admin/auth', 'admin/forgotPwd'];
    const url = (request as any).originalUrl;
    if (url.includes(urls[0] || urls[1])) {
      next();
      return;
    }
    const jwtTokenKey = jwtSecretKey.secretKey;
    const token = request.headers['authorization'];
    if (!token || !jwtTokenKey) {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          new GlobalResponseDto(
            HttpStatus.UNAUTHORIZED,
            'Token is required',
            null,
            [],
          ),
        );
    } else if (jwt.verify(token, jwtTokenKey)) {
      const userid = request.headers['userid'];
      if (!userid) {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new GlobalResponseDto(
              HttpStatus.BAD_REQUEST,
              'Mandatory headers are missing',
              null,
              [],
            ),
          );
      }
      const decoded: any = jwtDecode(token);
      if (decoded.user) {
        request['user'] = decoded.user;
        request['user'].userId = decoded.user.findUser._id;
        if (userid) {
          const userCustomerInfoData = await this._userDb.findOne({
            _id: decoded.user.findUser._id,
          });

          if (
            !userCustomerInfoData ||
            userCustomerInfoData.status !== StatusEnum.active
          ) {
            return response
              .status(HttpStatus.UNAUTHORIZED)
              .json(
                new GlobalResponseDto(
                  HttpStatus.UNAUTHORIZED,
                  'User not active',
                  null,
                  [],
                ),
              );
          }
          next();
          return;
        }
      }
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          new GlobalResponseDto(
            HttpStatus.UNAUTHORIZED,
            'Invalid Token, please login again',
            null,
            [],
          ),
        );
    } else {
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          new GlobalResponseDto(
            HttpStatus.UNAUTHORIZED,
            'Login expired, please login again',
            null,
            [],
          ),
        );
    }
  }
}
export interface AdminRequest extends Request {
  user: {
    userId: Schema.Types.ObjectId;
    identifier: string;
    address: {
      addressLine1: string;
      addressLine2: string;
      city: string;
      postalCode: string;
    };
    accessType: string;
    userContextId: Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
  };
}
