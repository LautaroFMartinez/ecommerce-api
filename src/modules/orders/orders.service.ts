import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto, OrderResponseDto } from './dto/Orders.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async addOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return await this.ordersRepository.addOrder(createOrderDto);
  }

  async getOrder(id: string): Promise<OrderResponseDto> {
    return await this.ordersRepository.getOrder(id);
  }
}
