import * as Joi from 'joi';
import { UnprocessableEntityException } from '@nestjs/common';
import { joiConfig } from 'src/config';
import { AuthRequestDto, AuthDto } from 'src/dto/adminRequest.dto';
import { AccessTypeEnum } from 'src/enums/accessType.enum';
import { StatusEnum } from 'src/enums/status.enum';

export class AuthValidator {
  static validateLogin = (authRequestDto: AuthRequestDto) => {
    const schema = Joi.object({
      username: Joi.string().required().messages({
        'string.empty': 'Username is required',
      }),
      password: Joi.string().required().messages({
        'string.empty': 'Password is required',
      }),
    });

    const { error } = schema.validate(authRequestDto, joiConfig);
    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };

  static validateSignup = (signupRequestDto: AuthDto) => {
    const schema = Joi.object({
      fullName: Joi.string().min(3).max(50).required(),

      username: Joi.string().alphanum().min(3).max(30).required(),

      password: Joi.string()
        .min(8)
        .max(50)
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
        .message('Password must contain at least one letter and one number')
        .required(),

      phoneNumber: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .message('Invalid phone number format')
        .optional(),

      accessType: Joi.string()
        .valid(AccessTypeEnum.admin, AccessTypeEnum.superAdmin)
        .required(),

      status: Joi.string()
        .valid(
          StatusEnum.active,
          StatusEnum.notVerified,
          StatusEnum.inActive,
          StatusEnum.deleted,
        )
        .default(StatusEnum.notVerified),

      avatar: Joi.string().uri().optional(),

      roles: Joi.array().items(Joi.string()).default([]),

      permissions: Joi.array().items(Joi.string()).default([]),
    });

    const { error } = schema.validate(signupRequestDto, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };
}
