import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const timeoutMS =
      this.reflector.get<number>('request-timeout', context.getHandler()) ||
      60000;
    return next.handle().pipe(
      timeout(timeoutMS),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}

const SetTimeout = (timeout: number) => SetMetadata('request-timeout', timeout);

export default function SetRequestTimeout(timeout = 600000) {
  return applyDecorators(
    SetTimeout(timeout),
    UseInterceptors(TimeoutInterceptor),
  );
}
