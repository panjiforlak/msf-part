import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request & { body?: any }>();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '******';

    return next.handle().pipe(
      tap((res) => {
        const duration = Date.now() - now;
        this.logger.log(` ${method} ${url} [${duration}ms]`);
        if (process.env.DEBUG == 'yes')
          this.logger.debug(
            `${JSON.stringify({ method: method, url: url, body: sanitizedBody, response: res.data })}`,
          );
      }),
      catchError((error) => {
        const duration = Date.now() - now;
        this.logger.error(
          ` ${method} ${url} [${duration}ms] Error: ${error.message}`,
        );
        if (process.env.DEBUG == 'yes')
          this.logger.debug(
            ` ${JSON.stringify({ method: method, url: url, body: sanitizedBody })}`,
          );

        return throwError(() => error);
      }),
    );
  }
}

export const MemoryFileInterceptor = () =>
  FileInterceptor('file', {
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: memoryFileFilter,
  });

function memoryFileFilter(
  req: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
): void {
  callback(null, true);
}
