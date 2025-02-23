import * as Joi from 'joi';
import { UnprocessableEntityException } from '@nestjs/common';

export class WorkshopSettingsValidator {
  static validateCreateSettings = (settingsDto: any) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      address: Joi.string().required(),
      contactNumber: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .message('Invalid contact number format')
        .required(),
      openingHours: Joi.string().required(),
      closingHours: Joi.string().required(),
    });

    const { error } = schema.validate(settingsDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };

  static validateUpdateSettings = (settingsDto: any) => {
    const schema = Joi.object({
      name: Joi.string().optional(),
      address: Joi.string().optional(),
      contactNumber: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .message('Invalid contact number format')
        .optional(),
      openingHours: Joi.string().optional(),
      closingHours: Joi.string().optional(),
    });

    const { error } = schema.validate(settingsDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };
}
