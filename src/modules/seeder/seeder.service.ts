import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Products } from '../products/entities/products.entity';
import { CategoriesService } from '../categories/categories.service';
import { productsService } from '../products/products.service';
import { Users } from '../users/entities/users.entity';
import { Orders } from '../orders/entities/orders.entity';
import { OrderDetails } from '../orders/entities/orderdetails.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: productsService,
  ) {}

  async seedDatabase(): Promise<void> {
    try {
      const categoriesCount = await this.categoriesRepository.count();
      const productsCount = await this.productsRepository.count();

      if (categoriesCount > 0 || productsCount > 0) {
        console.log('Database already contains data. Skipping seeding.');
        return;
      }

      console.log('Starting database seeding...');

      await this.categoriesService.seedCategories();
      console.log('Categories seeded successfully');

      await this.productsService.seeder();
      console.log('Products seeded successfully');

      console.log('Database seeding completed successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }

  async isDatabaseEmpty(): Promise<boolean> {
    const categoriesCount = await this.categoriesRepository.count();
    const productsCount = await this.productsRepository.count();

    return categoriesCount === 0 && productsCount === 0;
  }

  async resetDatabase(): Promise<void> {
    console.log('Resetting database...');

    try {
      await this.ordersRepository.createQueryBuilder().delete().execute();
      await this.orderDetailsRepository.createQueryBuilder().delete().execute();
      await this.productsRepository.createQueryBuilder().delete().execute();
      await this.usersRepository.createQueryBuilder().delete().execute();
      await this.categoriesRepository.createQueryBuilder().delete().execute();
      console.log('Database reset completed');
    } catch (error) {
      console.error('Error during database reset:', error);
      throw error;
    }
  }
}
