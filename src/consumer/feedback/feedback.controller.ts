import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GlobalResponseDto } from 'src/dto/global.response.dto';
import { Response } from 'express';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from 'src/dto/feedback.dto';
import { FeedbackValidator } from 'src/validators/feedbackValidator';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly _feedbackService: FeedbackService) {}

  @Post('create')
  async createFeedback(
    @Res() response: Response,
    @Body() feedbackDto: CreateFeedbackDto,
  ) {
    try {
      await FeedbackValidator.validateFeedbackCreation(feedbackDto);
      const createdFeedback =
        await this._feedbackService.createFeedback(feedbackDto);
      return response
        .status(HttpStatus.CREATED)
        .json(
          new GlobalResponseDto(
            HttpStatus.CREATED,
            'Feedback created successfully',
            createdFeedback,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(error?.message || 'Invalid data');
    }
  }

  @Get()
  async getAllFeedback(
    @Res() response: Response,
    @Query('search') searchValue?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const pageNumber = page ? parseInt(page, 10) : 1;

      const feedbacks = await this._feedbackService.getAllFeedback(
        limitNumber,
        pageNumber,
        searchValue,
      );

      return response.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Feedback retrieved successfully',
        data: feedbacks,
        errors: [],
      });
    } catch (error) {
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: error?.message || 'Failed to fetch feedback',
        errors: [],
      });
    }
  }

  @Get(':id')
  async getFeedback(@Res() response: Response, @Param('id') id: string) {
    try {
      const feedback = await this._feedbackService.getFeedbackById(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Feedback retrieved successfully',
            feedback,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Feedback not found',
      );
    }
  }

  @Delete(':id')
  async deleteFeedback(@Res() response: Response, @Param('id') id: string) {
    try {
      const deletedFeedback = await this._feedbackService.deleteFeedback(id);
      return response
        .status(HttpStatus.OK)
        .json(
          new GlobalResponseDto(
            HttpStatus.OK,
            'Feedback deleted successfully',
            deletedFeedback,
            [],
          ),
        );
    } catch (error) {
      throw new UnprocessableEntityException(
        error?.message || 'Feedback not found',
      );
    }
  }
}
