import * as Joi from 'joi';
import { UnprocessableEntityException } from '@nestjs/common';

export class FeedbackValidator {
  static validateFeedbackCreation = (feedbackDto: any) => {
    const schema = Joi.object({
      customerId: Joi.string().required(),
      orderId: Joi.string().required(),
      rating: Joi.number().min(1).max(10).required(),
      comments: Joi.string().optional(),
    });

    const { error } = schema.validate(feedbackDto, { abortEarly: false });

    if (error?.details) {
      throw new UnprocessableEntityException(error.details);
    }
  };
}
