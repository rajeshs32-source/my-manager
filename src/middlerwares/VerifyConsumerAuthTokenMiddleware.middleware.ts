import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
import { Response, NextFunction } from 'express';
// import mongoose, { Model, Schema } from 'mongoose';
import { GlobalResponseDto } from 'src/dto/global.response.dto';
// import {
//   UserCustomerInfo,
//   UserCustomerInfoEntity,
// } from 'src/entity/userCustomerInfo.entity';
// import { SecretManagerEnum } from 'src/enums/secretManager.enum';
import * as jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
// import { StatusEnum } from 'src/enums/status.enum';
// import { AccessTypeEnum } from 'src/enums/accessType.enum';
import { UserContextService } from 'src/shared/userContext.service';

@Injectable()
export class VerifyConsumerAuthTokenMiddleware implements NestMiddleware {
  constructor(private _userContextService: UserContextService) {}

  //   private _subscriptionService: SubscriptionService,
  //   private _customerDb: Model<CustomerEntity>,
  //   @InjectModel(Customer.name)
  //   private _userCustomerInfoDb: Model<UserCustomerInfoEntity>,
  //   @InjectModel(UserCustomerInfo.name)

  async use(request: Request, response: Response, next: NextFunction) {
    const urls = [
      'auth',
      'unit/getByBlockId',
      'customer',
      'forgotPwd',
      'getAlertNotificationsForAllUsers',
      'signupAnalytics',
      'log/mobile',
    ];
    const url = (request as any).originalUrl;
    if (
      url.includes(urls[0]) ||
      url.includes(urls[1]) ||
      url.includes(urls[2]) ||
      url.includes(urls[3]) ||
      url.includes(urls[4]) ||
      url.includes(urls[5]) ||
      url.includes(urls[6])
    ) {
      next();
      return;
    }
    // const jwtTokenKey = await CacheService.getValueOfKey(
    //   SecretManagerEnum.jwtSecret,
    // );
    const jwtTokenKey = process.env.JWT_SECRET;
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
      const customerid = request.headers['customerid'];
      const usercustomerinfoid = request.headers['usercustomerinfoid'];
      const blockid = request.headers['blockid'] ?? '';
      if (!customerid || !usercustomerinfoid) {
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
        request['user'].userId = decoded.user._id;
        request['user'].customerId = customerid;
        request['user'].userCustomerInfoId = usercustomerinfoid;
        request['user'].blockId = blockid;
        request['user'].identifier = decoded.user.identifier;
        if (customerid && usercustomerinfoid) {
          //   const userCustomerInfoData = await this._userCustomerInfoDb
          //     .findOne({
          //       _id: usercustomerinfoid,
          //     })
          //     .populate({
          //       path: 'userId',
          //       model: 'User',
          //     });
          //   if (
          //     !userCustomerInfoData ||
          //     userCustomerInfoData.status !== StatusEnum.active
          //   ) {
          //     return response
          //       .status(HttpStatus.UNAUTHORIZED)
          //       .json(
          //         new GlobalResponseDto(
          //           HttpStatus.UNAUTHORIZED,
          //           'User not active',
          //           null,
          //           [],
          //         ),
          //       );
          //   }
          //   if (userCustomerInfoData.accessType === AccessTypeEnum.admin) {
          //     request['user'].primaryTenantUserId = userCustomerInfoData.userId;
          //     request['user'].primaryTenantUserCustomerInfoId =
          //       userCustomerInfoData._id;
          //   } else {
          //   }
          //   request['user'].addressId = userCustomerInfoData.addressId;
          //   request['user'].unitId = userCustomerInfoData.unitId;
          //   request['user'].socure = userCustomerInfoData['userId']['socure'];
          //   const customerData = await this._customerDb.findOne({
          //     _id: customerid,
          //   });
          //   request['user']['customer'] = customerData;
          //   const userContext =
          //     await this._userContextService.getUserContext(usercustomerinfoid);
          //   request['user']['userContext'] = userContext;
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

// export interface GodomoConsumerRequest extends Request {
//   user: {
//     userId: Schema.Types.ObjectId;
//     primaryTenantUserId: Schema.Types.ObjectId;
//     identifier: string;
//     socure: object;
//     addressId: Schema.Types.ObjectId;
//     accessType: string;
//     customerId: Schema.Types.ObjectId;
//     userCustomerInfoId: Schema.Types.ObjectId;
//     primaryTenantUserCustomerInfoId: Schema.Types.ObjectId;
//     blockId: Schema.Types.ObjectId;
//     unitId: Schema.Types.ObjectId;
//     firstName: string;
//     lastName: string;
//     customer: {
//       featureFlags: {
//         isCreateNewTenantAllowed: boolean;
//         isBlockAddress: boolean;
//         isDefaultRentReporting: boolean;
//         isLeaseStartDateEditable: boolean;
//         isLeaseTermEditable: boolean;
//         isRentPerMonthEditable: boolean;
//         isMonthlyRentPaidRequired: boolean;
//       };
//     };
//     userContext: {
//       featureIdCodes: string[];
//     };
//   };
// }
