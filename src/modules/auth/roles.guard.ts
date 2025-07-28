import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { Request } from 'express';
import { Role, ROLES_KEY } from './decorators/roles.decorator';
import { JwtPayload } from './interfaces/jwtPayload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader: string | undefined = request.headers.authorization;

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

      const payload: JwtPayload = this.jwtService.verify(token, { secret });
      if (!payload || !payload.id) {
        throw new UnauthorizedException('Token inválido o expirado');
      }

      if (!payload.isActive) {
        throw new UnauthorizedException('Cuenta de usuario desactivada');
      }

      const user = await this.usersRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      request['user'] = user;

      const userRoles: Role[] = user.isAdmin
        ? [Role.ADMIN, Role.USER]
        : [Role.USER];
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role),
      );
      if (!hasRequiredRole) {
        throw new ForbiddenException(
          'Acceso denegado: no tienes los permisos necesarios',
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
