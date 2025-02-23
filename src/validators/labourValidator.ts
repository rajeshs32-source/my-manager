import * as Joi from 'joi';
import { UnprocessableEntityException } from '@nestjs/common';

export class LabourValidator {
  static validateLabourCreation = (labourDto: any) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .message('Invalid phone number format')
        .required(),
      role: Joi.string().valid('mechanic', 'electrician', 'helper').required(),
      experience: Joi.number().min(0).required(),
    });

    const { error } = schema.validate(labourDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };

  static validateLabourUpdate = (labourDto: any) => {
    const schema = Joi.object({
      name: Joi.string().optional(),
      phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .message('Invalid phone number format')
        .optional(),
      role: Joi.string().valid('mechanic', 'electrician', 'helper').optional(),
      experience: Joi.number().min(0).optional(),
    });

    const { error } = schema.validate(labourDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };
}
