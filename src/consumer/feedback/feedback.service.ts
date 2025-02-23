import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFeedbackDto } from 'src/dto/feedback.dto';
import { Feedback } from 'src/entity/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
  ) {}

  async createFeedback(
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    const feedback = new this.feedbackModel(createFeedbackDto);
    return feedback.save();
  }

  async getAllFeedback(
    limit = 10,
    page = 1,
    searchValue?: string,
  ): Promise<Feedback[]> {
    const query: Record<string, any> = {};

    if (searchValue) {
      const isNumber = !isNaN(Number(searchValue)); // Check if searchValue is a number

      query.$or = [
        { comment: new RegExp(searchValue, 'i') }, // Case-insensitive match for comment
        ...(isNumber ? [{ rating: Number(searchValue) }] : []), // Exact match for numeric rating
      ];
    }

    return this.feedbackModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }

  async getFeedbackById(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel.findById(id).exec();
    if (!feedback)
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    return feedback;
  }

  async deleteFeedback(id: string): Promise<Feedback> {
    const deletedFeedback = await this.feedbackModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedFeedback)
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    return deletedFeedback;
  }
}
