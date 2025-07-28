import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Category } from '../categories/entities/category.entity';
import { Products } from '../products/entities/products.entity';
import { CategoriesModule } from '../categories/categories.module';
import { productsModule } from '../products/products.module';
import { Users } from '../users/entities/users.entity';
import { Orders } from '../orders/entities/orders.entity';
import { OrderDetails } from '../orders/entities/orderdetails.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Products, Users, Orders, OrderDetails]),
    CategoriesModule,
    productsModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
