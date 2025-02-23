import * as Joi from 'joi';
import { UnprocessableEntityException } from '@nestjs/common';

export class ServiceValidator {
  static validateServiceCreation = (serviceDto: any) => {
    const schema = Joi.object({
      name: Joi.string().required().messages({
        'string.empty': 'Name is required',
      }),
      description: Joi.string().optional(),
      tags: Joi.array().items(Joi.string()).required().messages({
        'array.base': 'Tags must be an array of strings',
        'array.empty': 'Tags cannot be empty',
      }),
      category: Joi.string().required().messages({
        'string.empty': 'Category is required',
      }),
    });

    const { error } = schema.validate(serviceDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };

  static validateUpdateService = (serviceDto: any) => {
    const schema = Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      tags: Joi.array().items(Joi.string()).optional(),
      category: Joi.string().optional(),
    });

    const { error } = schema.validate(serviceDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };
}
