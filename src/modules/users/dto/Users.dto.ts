import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  address: string;
  phone: string;
  country?: string;
  city?: string;
  isAdmin?: boolean;
}

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'juan.perez@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'Juan Pérez',
    minLength: 3,
    maxLength: 80,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty({
    description: 'User password',
    example: 'MiPassword123!',
    minLength: 8,
    maxLength: 15,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,15}$',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)',
  })
  password: string;

  @ApiProperty({
    description: 'User address',
    example: 'Av. Corrientes 1234',
    minLength: 3,
    maxLength: 80,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+541123456789',
  })
  @IsNotEmpty()
  @IsNumberString()
  phone: string;

  @ApiPropertyOptional({
    description: 'User country',
    example: 'Argentina',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country?: string;

  @ApiPropertyOptional({
    description: 'User city',
    example: 'Buenos Aires',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  address: string;
  phone: string;
  country?: string;
  city?: string;
  orders?: {
    id: string;
    orderDetails?: {
      id: string;
      price: number;
      products?: {
        id: string;
        name: string;
        price: number;
        category?: {
          id: string;
          name: string;
        };
      }[];
    };
  }[];
}

export interface UserAdminResponse {
  id: string;
  email: string;
  name: string;
  address: string;
  phone: string;
  country?: string;
  city?: string;
  isAdmin: boolean;
  isActive: boolean;
  orders?: {
    id: string;
  }[];
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe',
    minLength: 3,
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional({
    description: 'User password',
    example: 'MyPassword123!',
    minLength: 8,
    maxLength: 15,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,15}$',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'User address',
    example: '123 Main Street',
    minLength: 3,
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '1234567890',
  })
  @IsOptional()
  @IsNumberString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User country',
    example: 'Argentina',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country?: string;

  @ApiPropertyOptional({
    description: 'User city',
    example: 'Buenos Aires',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city?: string;
}

export interface PaginatedUsers {
  data: UserAdminResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserLoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'admin@admin.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'adminPwd123!',
    minLength: 8,
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  password: string;
}

export class GetUserByIdDto {
  @ApiProperty({
    description: 'User UUID',
    example: '58b74b20-5e13-4cc6-b9fb-f683c431c198',
    format: 'uuid',
  })
  @IsUUID(4, { message: 'ID must be a valid UUID' })
  id: string;
}

export class UserSignUpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'juan.perez@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'Juan Pérez',
    minLength: 3,
    maxLength: 80,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty({
    description: 'User password',
    example: 'MiPassword123!',
    minLength: 8,
    maxLength: 15,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,15}$',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)',
  })
  password: string;

  @ApiProperty({
    description: 'Confirm password (must match password)',
    example: 'MiPassword123!',
    minLength: 8,
    maxLength: 15,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,15}$',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)',
  })
  confirmPassword: string;

  @ApiProperty({
    description: 'User address',
    example: 'Av. Corrientes 1234',
    minLength: 3,
    maxLength: 80,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+541123456789',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User country',
    example: 'Argentina',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country?: string;

  @ApiPropertyOptional({
    description: 'User city',
    example: 'Buenos Aires',
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city?: string;
}

export class DeactivateUserDto {
  @ApiProperty({
    description: 'User UUID to deactivate',
    example: '58b74b20-5e13-4cc6-b9fb-f683c431c198',
    format: 'uuid',
  })
  @IsUUID(4, { message: 'ID must be a valid UUID' })
  id: string;
}
