/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  InternalServerErrorException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UserResponse,
  UpdateUserDto,
  PaginatedUsers,
  GetUserByIdDto,
} from './dto/Users.dto';
import { PaginationDto } from './dto/Pagination.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';

@ApiTags('Users')
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users with pagination (Admin only)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              phone: { type: 'string' },
              country: { type: 'string' },
              address: { type: 'string' },
              city: { type: 'string' },
              isAdmin: { type: 'boolean' },
              orders: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                  },
                },
              },
            },
          },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token missing or invalid' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  async getUsers(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedUsers> {
    try {
      return await this.usersService.getUsers(
        paginationDto.page || 1,
        paginationDto.limit || 5,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'User UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        country: { type: 'string' },
        address: { type: 'string' },
        city: { type: 'string' },
        orders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Token missing or invalid' })
  async getUserById(@Param() params: GetUserByIdDto): Promise<UserResponse> {
    try {
      return await this.usersService.getUserById(params.id);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Token missing or invalid' })
  async updateUser(
    @Body() userData: UpdateUserDto,
    @GetUser('id') userId: string,
  ): Promise<{ id: string }> {
    try {
      return await this.usersService.updateUser(userId, userData);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      if (error.code === '23505') {
        throw new BadRequestException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }
  @Delete(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate user by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'User UUID to deactivate',
  })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        message: {
          type: 'string',
          example: 'User has been successfully deactivated',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or already deactivated',
  })
  @ApiUnauthorizedResponse({ description: 'Token missing or invalid' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  async deactivateUser(
    @Param() params: GetUserByIdDto,
  ): Promise<{ id: string; message: string }> {
    try {
      return await this.usersService.deactivateUser(params.id);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to deactivate user');
    }
  }
}
