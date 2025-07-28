import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Products } from 'src/modules/products/entities/products.entity';
import { CreateOrderDto, OrderResponseDto } from './dto/Orders.dto';
import { Users } from 'src/modules/users/entities/users.entity';
import { OrderDetails } from './entities/orderdetails.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
  ) {}

  async addOrder(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    const user = await this.usersRepository.findOneBy({ id: orderData.userId });
    if (!user) {
      throw new NotFoundException(`User with id ${orderData.userId} not found`);
    }

    const productIds = orderData.products.map((p) => p.id);
    const products = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.id IN (:...ids)', { ids: productIds })
      .getMany();

    if (products.length === 0) {
      throw new BadRequestException('No products found');
    }

    const foundProductIds = products.map((p) => p.id);
    const missingProducts = productIds.filter(
      (id) => !foundProductIds.includes(id),
    );

    if (missingProducts.length > 0) {
      throw new BadRequestException(
        `Products not found: ${missingProducts.join(', ')}`,
      );
    }

    const stockErrors: string[] = [];
    const productQuantityMap = new Map<string, number>();

    orderData.products.forEach((orderProduct) => {
      productQuantityMap.set(orderProduct.id, orderProduct.quantity);
    });

    products.forEach((product) => {
      const requestedQuantity = productQuantityMap.get(product.id) || 0;
      if (product.stock < requestedQuantity) {
        stockErrors.push(
          `${product.name} - requested: ${requestedQuantity}, available: ${product.stock}`,
        );
      }
    });

    if (stockErrors.length > 0) {
      throw new BadRequestException(
        `Insufficient stock for: ${stockErrors.join('; ')}`,
      );
    }

    const totalPrice = products.reduce((total, product) => {
      const quantity = productQuantityMap.get(product.id) || 0;
      return total + Number(product.price) * quantity;
    }, 0);

    const orderDetails = this.orderDetailsRepository.create({
      price: totalPrice,
      products: products,
    });

    const savedOrderDetails =
      await this.orderDetailsRepository.save(orderDetails);

    const order = this.ordersRepository.create({
      user: user,
      orderDetails: savedOrderDetails,
    });

    const savedOrder = await this.ordersRepository.save(order);

    await Promise.all(
      products.map(async (product) => {
        const requestedQuantity = productQuantityMap.get(product.id) || 0;
        product.stock -= requestedQuantity;
        await this.productsRepository.save(product);
      }),
    );

    return {
      userId: savedOrder.user.id,
      id: savedOrder.id,
      date: savedOrder.date,
      orderDetails: {
        id: savedOrderDetails.id,
        price: savedOrderDetails.price,
        products: products.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          imgUrl: product.imgUrl,
        })),
      },
    };
  }

  async getOrder(id: string): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: [
        'user',
        'orderDetails',
        'orderDetails.products',
        'orderDetails.products.category',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return {
      userId: order.user.id,
      id: order.id,
      date: order.date,
      orderDetails: {
        id: order.orderDetails.id,
        price: order.orderDetails.price,
        products: order.orderDetails.products.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          imgUrl: product.imgUrl,
        })),
      },
    };
  }
}
