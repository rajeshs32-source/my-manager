import * as Joi from 'joi';
import { UnprocessableEntityException } from '@nestjs/common';
import { StatusEnum } from 'src/enums/status.enum';
import { RoleEnum } from 'src/enums/role.enum';

export class UserValidator {
  static validateUserCreation = (userDto: any) => {
    const schema = Joi.object({
      name: Joi.string().required().messages({
        'string.empty': 'Name is required',
      }),

      address: Joi.object({
        addressLine1: Joi.string().required(),
        addressLine2: Joi.string().optional(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
      }).required(),

      phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .message('Invalid phone number format')
        .required(),

      role: Joi.string()
        .valid(RoleEnum.customer, RoleEnum.labour)
        .default(RoleEnum.customer),

      status: Joi.string()
        .valid(StatusEnum.active, StatusEnum.inActive, StatusEnum.deleted)
        .default(StatusEnum.active),

      avatar: Joi.string().uri().optional(),

      gender: Joi.string().optional(),
    });

    const { error } = schema.validate(userDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };

  static validateUserUpdate = (userDto: any) => {
    const schema = Joi.object({
      name: Joi.string().optional(),
      address: Joi.object({
        addressLine1: Joi.string().optional(),
        addressLine2: Joi.string().optional(),
        city: Joi.string().optional(),
        postalCode: Joi.string().optional(),
      }).optional(),
      phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .message('Invalid phone number format')
        .optional(),
      role: Joi.string().valid(RoleEnum.customer, RoleEnum.labour).optional(),
      status: Joi.string()
        .valid(StatusEnum.active, StatusEnum.inActive, StatusEnum.deleted)
        .optional(),
      avatar: Joi.string().uri().optional(),
      gender: Joi.string().optional(),
    });

    const { error } = schema.validate(userDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };
}
