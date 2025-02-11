// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
require('dotenv').config();
export const config = {
  ENVIRONMENT: process.env.ENVIRONMENT,
  LOG_GROUP_NAME: process.env.LOG_GROUP_NAME,
  LOG_STREAM_NAME: process.env.LOG_STREAM_NAME,
};

export const joiConfig = {
  abortEarly: false,
  allowUnknown: true,
};
export const jwtSecretKey = {
  secretKey: process.env.JWT_SECRET,
};
