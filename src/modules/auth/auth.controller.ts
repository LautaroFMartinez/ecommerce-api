import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, UserSignUpDto } from '../users/dto/Users.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User sign in' })
  @ApiBody({
    type: UserLoginDto,
    description: 'User credentials for authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Bienvenido Juan Pérez' },
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  async signIn(@Body() signInData: UserLoginDto): Promise<{ message: string }> {
    return await this.authService.signIn(signInData);
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({
    type: UserSignUpDto,
    description: 'User data for registration',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', example: 'Juan Pérez' },
        email: {
          type: 'string',
          format: 'email',
          example: 'juan.perez@example.com',
        },
        phone: { type: 'string', example: '+541123456789' },
        country: { type: 'string', example: 'Argentina' },
        address: { type: 'string', example: 'Av. Corrientes 1234' },
        city: { type: 'string', example: 'Buenos Aires' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Email already registered or validation error',
  })
  async signUp(@Body() signUpData: UserSignUpDto) {
    return await this.authService.signUp(signUpData);
  }
}
