/* eslint-disable @typescript-eslint/no-var-requires */
// import { ConfigService } from './config.service';
// import { EnvironmentConfigEnum } from 'src/enums/environmentConfig.enum';

import winston from 'winston';
// import WinstonCloudWatch from 'winston-cloudwatch';

export class LogService {
  // static initializeLogger(logGroupName: string, logStreamName: string) {
  //   AWS.config.update({
  //     region: EnvironmentConfigEnum[ConfigService.getEnvironment()].REGION,
  //     accessKeyId:
  //       EnvironmentConfigEnum[ConfigService.getEnvironment()].ACCESS_KEY_ID,
  //     secretAccessKey:
  //       EnvironmentConfigEnum[ConfigService.getEnvironment()].SECRET_ACCESS_KEY,
  //   });
  //   // winston.add(
  //   //   new WinstonCloudWatch({
  //   //     cloudWatchLogs: new AWS.CloudWatchLogs(),
  //   //     logGroupName: logGroupName,
  //   //     logStreamName: logStreamName,
  //   //   }),
  //   // );
  // }

  static async logError(message: string, path: string, methodName: string) {
    winston.error(`${message} ${path} ${methodName}`);
  }

  // static async logInformation(
  //   message: string,
  //   path: string,
  //   methodName: string,
  // ) {
  //   winston.log({
  //     level: 'info',
  //     message: `${message} ${path} ${methodName}`,
  //   });
  // }
}
