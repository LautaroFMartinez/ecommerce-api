import {
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsUUID,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderProductPayloadDto {
  @ApiProperty({
    description: 'Product UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsUUID(4, { message: 'Product ID must be a valid UUID' })
  id: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;
}

export class CreateOrderProductDto {
  @ApiProperty({
    description: 'Product UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsUUID(4, { message: 'Product ID must be a valid UUID' })
  id: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiProperty({
    description: 'Array of products to order',
    type: [CreateOrderProductDto],
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        quantity: 2,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        quantity: 3,
      },
    ],
  })
  @IsArray({ message: 'Products must be an array' })
  @ArrayMinSize(1, { message: 'At least one product is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];

  @ApiProperty({
    description: 'Total quantity of products in the order',
    example: 5,
  })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;
}

export class CreateOrderPayloadDto {
  @ApiProperty({
    description: 'Array of products to order',
    type: [CreateOrderProductPayloadDto],
    example: [
      {
        id: '58be1acd-2173-4c09-ac16-1b80b3a63d65',
        quantity: 2,
      },
      {
        id: '80d7c1ff-5ed5-41a2-9ea5-68dfcaf7a747',
        quantity: 3,
      },
    ],
  })
  @IsArray({ message: 'Products must be an array' })
  @ArrayMinSize(1, { message: 'At least one product is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductPayloadDto)
  products: CreateOrderProductPayloadDto[];
}

export class GetOrderByIdDto {
  @ApiProperty({
    description: 'Order UUID',
    example: '987d7921-5ec3-4153-ac2c-4863c3d34ba5',
    format: 'uuid',
  })
  @IsUUID(4, { message: 'Order ID must be a valid UUID' })
  id: string;
}

export class OrderProductDto {
  @ApiProperty({
    description: 'Product UUID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 14 Pro',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with Pro camera system',
  })
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 1299.99,
  })
  price: number;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/images/iphone14pro.jpg',
  })
  imgUrl: string;
}

export class OrderDetailsDto {
  @ApiProperty({
    description: 'Order details UUID',
    example: '66666666-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Total price of the order',
    example: 2599.98,
  })
  price: number;

  @ApiProperty({
    description: 'Products in the order',
    type: [OrderProductDto],
  })
  products: OrderProductDto[];
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'User UUID (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    description: 'Order UUID',
    example: '98765432-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Order creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Order details with products',
    type: OrderDetailsDto,
  })
  orderDetails: OrderDetailsDto;
}
