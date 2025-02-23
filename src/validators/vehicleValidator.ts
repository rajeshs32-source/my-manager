import * as Joi from 'joi';
import { UnprocessableEntityException } from '@nestjs/common';

export class VehicleValidator {
  static validateVehicleCreation = (vehicleDto: any) => {
    const schema = Joi.object({
      licensePlate: Joi.string().required().messages({
        'string.empty': 'Registration number is required',
      }),
      model: Joi.string().required(),
      make: Joi.string().required(),
      year: Joi.number()
        .integer()
        .min(1886)
        .max(new Date().getFullYear())
        .required(),
      ownerId: Joi.string().required(),
      insuranceService: Joi.boolean().required(),
    });

    const { error } = schema.validate(vehicleDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };

  static validateVehicleUpdate = (vehicleDto: any) => {
    const schema = Joi.object({
      licensePlate: Joi.string().optional(),
      model: Joi.string().optional(),
      make: Joi.string().optional(),
      year: Joi.number()
        .integer()
        .min(1886)
        .max(new Date().getFullYear())
        .optional(),
      ownerId: Joi.string().optional(),
      insuranceService: Joi.boolean().required(),
    });

    const { error } = schema.validate(vehicleDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };
}
