import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { productsController } from './products.controller';
import { productsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Products } from './entities/products.entity';
import { Category as Categories } from 'src/modules/categories/entities/category.entity';
import { Users } from '../users/entities/users.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Categories, Users]),
    AuthModule,
  ],
  controllers: [productsController],
  providers: [productsService, ProductsRepository],
  exports: [ProductsRepository, productsService],
})
export class productsModule {}
