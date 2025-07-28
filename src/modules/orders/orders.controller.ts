/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  CreateOrderPayloadDto,
  OrderResponseDto,
  GetOrderByIdDto,
} from './dto/Orders.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';

@ApiTags('Orders')
@Controller('orders')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    type: CreateOrderPayloadDto,
    description: 'Order data with products (user ID taken from token)',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token missing or invalid' })
  @ApiBadRequestResponse({
    description: 'Invalid order data or insufficient stock',
  })
  async create(
    @Body() createOrderPayloadDto: CreateOrderPayloadDto,
    @GetUser('id') userId: string,
  ): Promise<OrderResponseDto> {
    try {
      const createOrderDto: CreateOrderDto = {
        userId,
        products: createOrderPayloadDto.products.map((product) => ({
          id: product.id,
          quantity: product.quantity,
        })),
        quantity: createOrderPayloadDto.products.reduce(
          (total, product) => total + product.quantity,
          0,
        ),
      };
      return await this.ordersService.addOrder(createOrderDto);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      if (error.status === 400) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Order UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiUnauthorizedResponse({ description: 'Token missing or invalid' })
  async findOne(@Param() params: GetOrderByIdDto): Promise<OrderResponseDto> {
    try {
      return await this.ordersService.getOrder(params.id);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve order');
    }
  }
}
