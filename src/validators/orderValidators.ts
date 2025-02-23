import Joi from 'joi';
import { UnprocessableEntityException } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/order.dto';
import {
  PaymentMethodEnum,
  ServiceCategoryEnum,
} from 'src/enums/serviceCategory.enum';

const joiConfig = { abortEarly: false, allowUnknown: true };

export class OrderValidator {
  static validateOrderCreation = (orderDto: CreateOrderDto) => {
    const schema = Joi.object({
      customerId: Joi.string().hex().length(24).required().messages({
        'string.length': 'Invalid customer ID format',
        'any.required': 'Customer ID is required',
      }),

      vehicleId: Joi.string().hex().length(24).required().messages({
        'string.length': 'Invalid vehicle ID format',
        'any.required': 'Vehicle ID is required',
      }),

      orderNumber: Joi.number().optional(),

      services: Joi.array()
        .items(
          Joi.object({
            serviceIds: Joi.string().hex().length(24).required().messages({
              'string.length': 'Invalid service ID format',
              'any.required': 'Service ID is required',
            }),

            Description: Joi.string().required().messages({
              'string.empty': 'Description is required',
            }),

            image: Joi.string().uri().required().messages({
              'string.uri': 'Image must be a valid URL',
              'any.required': 'Image URL is required',
            }),
          }),
        )
        .required()
        .messages({ 'any.required': 'Services are required' }),

      orderDate: Joi.date().iso().required().messages({
        'date.format': 'Order date must be in YYYY-MM-DD format',
        'any.required': 'Order date is required',
      }),

      expectedDeliveryDate: Joi.date().iso().required().messages({
        'date.format': 'Expected delivery date must be in YYYY-MM-DD format',
        'any.required': 'Expected delivery date is required',
      }),

      billDetails: Joi.array()
        .items(
          Joi.object({
            ServiceCategory: Joi.string()
              .valid(...Object.values(ServiceCategoryEnum))
              .required()
              .messages({ 'any.only': 'Invalid Service Category' }),

            advancePayment: Joi.string().required().messages({
              'string.empty': 'Advance payment is required',
            }),

            paymentdate: Joi.date().iso().required().messages({
              'date.format': 'Payment date must be in YYYY-MM-DD format',
              'any.required': 'Payment date is required',
            }),

            paymentMode: Joi.string()
              .valid(...Object.values(PaymentMethodEnum))
              .required()
              .messages({ 'any.only': 'Invalid Payment Mode' }),
          }),
        )
        .required()
        .messages({ 'any.required': 'Bill details are required' }),

      status: Joi.string()
        .valid('pending', 'in-progress', 'completed', 'canceled')
        .default('pending')
        .messages({ 'any.only': 'Invalid status' }),

      createdAt: Joi.date().default(Date.now),
      updatedAt: Joi.date().default(Date.now),
    });

    const { error } = schema.validate(orderDto, joiConfig);

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };

  static validateOrderUpdate = (orderDto: UpdateOrderDto) => {
    const schema = Joi.object({
      customerId: Joi.string().hex().length(24).optional(),
      vehicleId: Joi.string().hex().length(24).optional(),
      orderNumber: Joi.number().optional(),
      services: Joi.array()
        .items(
          Joi.object({
            serviceIds: Joi.string().hex().length(24).optional(),
            Description: Joi.string().optional(),
            image: Joi.string().uri().optional(),
          }),
        )
        .optional(),

      orderDate: Joi.date().iso().optional(),
      expectedDeliveryDate: Joi.date().iso().optional(),

      billDetails: Joi.array()
        .items(
          Joi.object({
            ServiceCategory: Joi.string()
              .valid(...Object.values(ServiceCategoryEnum))
              .optional(),

            advancePayment: Joi.string().optional(),
            paymentdate: Joi.date().iso().optional(),
            paymentMode: Joi.string()
              .valid(...Object.values(PaymentMethodEnum))
              .optional(),
          }),
        )
        .optional(),

      status: Joi.string()
        .valid('pending', 'in-progress', 'completed', 'canceled')
        .optional(),

      updatedAt: Joi.date().default(Date.now),
    });

    const { error } = schema.validate(orderDto, joiConfig);

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };
}
