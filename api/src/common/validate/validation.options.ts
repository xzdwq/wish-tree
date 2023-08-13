import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
    new HttpException(
      {
        success: false,
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        error: errors.reduce(
          (accumulator, currentValue) => ({
            ...accumulator,
            [currentValue.property]: Object.values(
              currentValue.constraints ?? {},
            ).join(', '),
          }),
          {},
        ),
        timestamp: new Date().toLocaleTimeString('ru', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        }),
        message: 'Validation error',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
};

export default validationOptions;
