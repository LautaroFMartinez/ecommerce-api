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
  UsePipes,
  ValidationPipe,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { productsService } from './products.service';
import { Products } from './entities/products.entity';
import { GetProductByIdDto, UpdateProductDto } from './dto/Products.dto';
import { PaginationDto } from '../users/dto/Pagination.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class productsController {
  constructor(private readonly productsService: productsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all products with pagination' })
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
    description: 'Products retrieved successfully',
    type: [Products],
  })
  async getProducts(@Query() paginationDto: PaginationDto) {
    try {
      return await this.productsService.getProducts(
        paginationDto.page || 1,
        paginationDto.limit || 5,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve products',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  @Get('seeder')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Seed products database' })
  @ApiResponse({
    status: 201,
    description: 'Products seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Products seeded successfully' },
      },
    },
  })
  async seedProducts() {
    try {
      return await this.productsService.seeder();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to seed products',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Product UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: Products,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param() params: GetProductByIdDto): Promise<Products> {
    try {
      return await this.productsService.getProductById(params.id);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve product');
    }
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Admin only)' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Product UUID',
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Product data to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Products,
  })
  @ApiUnauthorizedResponse({ description: 'Token missing or invalid' })
  @ApiForbiddenResponse({ description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param() params: GetProductByIdDto,
    @Body() updateData: UpdateProductDto,
  ): Promise<Products> {
    try {
      return await this.productsService.updateProduct(params.id, updateData);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update product',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
