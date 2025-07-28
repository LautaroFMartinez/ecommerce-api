import {
  IsUUID,
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from 'src/modules/categories/entities/category.entity';

export class GetProductByIdDto {
  @ApiProperty({
    description: 'Product UUID',
    example: '80d7c1ff-5ed5-41a2-9ea5-68dfcaf7a747',
    format: 'uuid',
  })
  @IsUUID(4, { message: 'Product ID must be a valid UUID' })
  id: string;
}

export class GetProductsQueryDto {
  @IsOptional()
  @IsNumber({}, { message: 'Page must be a number' })
  @IsPositive({ message: 'Page must be a positive number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  @IsPositive({ message: 'Limit must be a positive number' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsOptional()
  @IsString()
  imgUrl?: string;

  @IsUUID(4, { message: 'Category ID must be a valid UUID' })
  categoryId: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'iPhone 14 Pro',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Latest iPhone with Pro features',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price',
    example: 999.99,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({
    description: 'Product stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  stock?: number;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  imgUrl?: string;

  @ApiPropertyOptional({
    description: 'Category UUID',
    example: 'd9532fab-d5f0-423d-8f4d-86fe92db4b32',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Category ID must be a valid UUID' })
  categoryId?: string;

  @IsOptional()
  category?: Category;
}
