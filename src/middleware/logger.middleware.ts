import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware {
  use = (req: Request, res: Response, next: NextFunction) => {
    const now = new Date();
    const date = now.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const time = now.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    console.log(
      `[${date} ${time}] Metodo: ${req.method} Hacia: ${req.originalUrl}`,
    );
    next();
  };
}
