import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { Order } from './entities/order.entity';
import { Users } from 'src/modules/users/entities/users.entity';
import { Products } from 'src/modules/products/entities/products.entity';
import { OrderDetails } from './entities/orderdetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Users, Products, OrderDetails])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
