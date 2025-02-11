// import { EnvironmentConfigEnum } from 'src/enums/environmentConfig.enum';

export class ConfigService {
  static environment;

  static async setEnvironment(
    environment: string,
    logGroupName: string,
    logStreamName: string,
  ) {
    console.log('\u001b[31m' + `ENVIRONMENT: ${environment}` + '\u001b[31m');
    console.log(`LOG GROUP NAME: ${logGroupName}`);
    console.log(`LOG STREAM NAME: ${logStreamName}`);
    if (!environment || environment !== 'QA') {
      console.error('INVALID ENVIRONMENT');
    } else {
      this.environment = environment;
      // LogService.initializeLogger(logGroupName, logStreamName);
      console.log('LOGGER INITIALIZED');
      console.log('CACHE SETUP INITIALIZED');
      // await CacheService.setAwsSecretKeysIntoCache();
      console.log('CACHE SETUP COMPLETED');
    }
  }

  static getEnvironment(): string {
    return this.environment;
  }

  //   static getAwsConfig() {
  //     return {
  //       region: EnvironmentConfigEnum[ConfigService.getEnvironment()].REGION,
  //       accessKeyId:
  //         EnvironmentConfigEnum[ConfigService.getEnvironment()].ACCESS_KEY_ID,
  //       secretAccessKey:
  //         EnvironmentConfigEnum[ConfigService.getEnvironment()].SECRET_ACCESS_KEY,
  //     };
  //   }

  static getConfig() {
    return {
      dbUri: `${ConfigService.getEnvironment()}/DB_URI`,
    };
  }
}
