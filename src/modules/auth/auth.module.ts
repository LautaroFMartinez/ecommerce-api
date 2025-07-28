import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles.guard';
import { Users } from 'src/modules/users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard],
  exports: [RolesGuard],
})
export class AuthModule {}
