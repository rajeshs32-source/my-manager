import * as Joi from 'joi';
import { UnprocessableEntityException } from '@nestjs/common';
import { joiConfig } from 'src/config';
import { AuthRequestDto, SignupRequestDto } from 'src/dto/adminRequest.dto';

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

  static validateSignup = (signupRequestDto: SignupRequestDto) => {
    const schema = Joi.object({
      username: Joi.string().required().messages({
        'string.empty': 'Username is required',
      }),
      password: Joi.string().required().messages({
        'string.empty': 'Password is required',
      }),
      firstName: Joi.string().required().messages({
        'string.empty': 'firstName is required',
      }),
      lastName: Joi.string().required().messages({
        'string.empty': 'lastName is required',
      }),
      termsAndCondChecked: Joi.boolean().required().messages({
        'boolean.empty': 'termsAndCondChecked is required',
      }),
      addressLine1: Joi.allow(),
      addressLine2: Joi.allow(),
      city: Joi.string().required().messages({
        'string.empty': 'city is required',
      }),
      postalCode: Joi.allow(),
      accessType: Joi.string().required().messages({
        'string.empty': 'Access Type is required',
      }),
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
