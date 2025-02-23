import * as Joi from 'joi';
import { UnprocessableEntityException } from '@nestjs/common';

export class SalaryValidator {
  static validateSalaryCreation = (salaryDto: any) => {
    const schema = Joi.object({
      labourId: Joi.string().required(),
      amount: Joi.number().min(0).required(),
      date: Joi.date().iso().required(),
      status: Joi.string().valid('paid', 'pending').required(),
    });

    const { error } = schema.validate(salaryDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };

  static validateSalaryUpdate = (salaryDto: any) => {
    const schema = Joi.object({
      labourId: Joi.string().optional(),
      amount: Joi.number().min(0).optional(),
      date: Joi.date().iso().optional(),
      status: Joi.string().valid('paid', 'pending').optional(),
    });

    const { error } = schema.validate(salaryDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };
}
