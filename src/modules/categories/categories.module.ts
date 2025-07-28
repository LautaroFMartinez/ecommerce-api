import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryRepository, CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoryRepository, CategoriesService],
})
export class CategoriesModule {}
