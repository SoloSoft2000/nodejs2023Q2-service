import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    await this.loggingService.logRequest(
      req.baseUrl,
      req.method,
      req.query,
      req.body,
    );
    res.on('finish', async () => {
      await this.loggingService.logResponse(res.statusCode);
    });
    next();
  }
}
