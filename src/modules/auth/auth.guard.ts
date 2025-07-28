import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { JwtPayload } from './interfaces/jwtPayload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    config();
  }
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader: string | undefined = request.headers
      .authorization as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Token no proporcionado o formato no válido',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        'Token no proporcionado o formato no válido',
      );
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET_KEY');
      if (!secret) {
        throw new UnauthorizedException('Clave secreta no configurada');
      }
      const payload = this.jwtService.verify<JwtPayload>(token, { secret });
      if (!payload || !payload.id) {
        throw new UnauthorizedException('Token inválido o expirado');
      }

      if (!payload.isActive) {
        throw new UnauthorizedException('Cuenta de usuario desactivada');
      }

      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
