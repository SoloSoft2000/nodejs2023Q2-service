import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AppFilter<T> implements ExceptionFilter {
  private logger = new Logger(AppFilter.name);
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    if (status < 500) {
      this.logger.warn(`code: ${status} | message: ${message}`);
    } else {
      this.logger.error(`code: ${status} | message: ${message}`);
    }

    response.status(status).json({
      statusCode: status,
      path: request.baseUrl,
      message: message,
    });
  }
}
