import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

interface HttpExceptionResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  [key: string]: any;
}

type ErrorWithStack = Error & {
  stack?: string;
  [key: string]: any;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal Server Error';
    let error = 'UnknownError';
    let details: Record<string, any> | null = null;

    if (exception instanceof TokenExpiredError) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Token Expirado';
      error = 'TokenExpiredError';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const exceptionObj = exceptionResponse as HttpExceptionResponse;
        message = exceptionObj.message || message;
        error = exceptionObj.error || error;

        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          message: _,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          error: __,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          statusCode: ___,
          ...rest
        } = exceptionObj;
        if (Object.keys(rest).length > 0) {
          details = rest;
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      const err = exception as ErrorWithStack;
      error = err.name || 'Error';
      message = err.message || 'Ocorreu um erro inesperado';

      if (process.env.NODE_ENV !== 'production' && err.stack) {
        details = {
          stack: err.stack.split('\n'),
        };
      }

      if (error === 'TypeError') {
        status = HttpStatus.BAD_REQUEST;
      } else if (error === 'ReferenceError') {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, message: msg, stack, ...customProps } = err;
      if (Object.keys(customProps).length > 0) {
        details = details || {};
        Object.assign(details, customProps);
      }
    } else if (exception !== null && typeof exception === 'object') {
      try {
        const unknownObj = exception as Record<string, any>;
        if ('message' in unknownObj) {
          message = String(unknownObj.message);
        }
        if ('name' in unknownObj) {
          error = String(unknownObj.name);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name, message: msg, stack, ...rest } = unknownObj;
        if (Object.keys(rest).length > 0) {
          details = rest;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        error = 'UnprocessableError';
        message = 'Erro não processável';
      }
    }

    if (Array.isArray(message) && message.length === 1) {
      message = message[0];
    }

    const messageStr = Array.isArray(message) ? message.join(', ') : message;
    this.logger.error(
      `Status: ${status} | Error: ${error} | Message: ${messageStr}${
        details ? ` | Details: ${JSON.stringify(details)}` : ''
      }`,
      exception instanceof Error ? exception.stack : '',
    );

    interface ResponseBody {
      statusCode: number;
      error: string;
      message: string | string[];
      timestamp: string;
      details?: Record<string, any>;
    }

    const responseBody: ResponseBody = {
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
    };

    if (process.env.NODE_ENV !== 'production' && details) {
      responseBody.details = details;
    }

    response.status(status).json(responseBody);
  }
}
