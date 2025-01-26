import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';

export class AmoEntityError extends Error {
  constructor(
    public readonly message: string = '',
    public readonly status: number = 0,
  ) {
    super(message);
  }

  static fromAxoisError(error: AxiosError) {
    return new AmoEntityError(error?.message ?? '', error?.status);
  }
}

// выводим инфу об амо ошибке на клиент
@Catch(AmoEntityError)
export class AmoEntityFilter implements ExceptionFilter {
  catch(exception: AmoEntityError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(503).json({
      status: exception.status,
      message: exception.message,
    });
  }
}
