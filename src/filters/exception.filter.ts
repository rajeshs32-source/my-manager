import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GlobalResponseDto } from 'src/dto/global.response.dto';
import { LogService } from 'src/shared/log.service';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      LogService.logError(
        `${
          exception?.response?.data?.message
            ? exception?.response?.data?.message
            : exception?.response?.data
        } ${exception?.['stack']}`,
        request?.url,
        '',
      );
    }

    const errors =
      exception instanceof UnprocessableEntityException
        ? exception?.['response']?.['message']
        : [];

    // const message1 = !(exception instanceof UnprocessableEntityException)
    //   ? exception?.['response']?.['message']
    //     ? exception?.['response']?.['message']
    //     : httpStatus === HttpStatus.INTERNAL_SERVER_ERROR
    //     ? 'Something went wrong'
    //     : ''
    //   : '';

    let message = '';
    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR)
      message = 'Something went wrong';
    else if (!(exception instanceof UnprocessableEntityException))
      message = exception?.['response']?.['message'];

    const responseBody = new GlobalResponseDto(
      httpStatus,
      message,
      null,
      errors,
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
