import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isDev =
      process.env.SHOW_ERROR_STACK === 'true' ||
      process.env.NODE_ENV === 'development';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const message =
      typeof errorResponse === 'string'
        ? errorResponse
        : (errorResponse as any).message || 'Unknown error';

    const resBody: any = {
      statusCode: status,
      message,
      data: {
        error: true,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    };

    if (isDev) {
      resBody.stack = (exception as any).stack;
      this.logger.error(
        `[${request.method}] ${request.url} - ${message}`,
        (exception as any).stack,
      );
    }

    response.status(status).json(resBody);
  }
}
