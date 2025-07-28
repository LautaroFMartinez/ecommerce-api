import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import * as categoriesData from '../../data/data.json';

interface CategoryData {
  category: string;
}

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.repo.find();
  }

  async addCategories() {
    await Promise.all(
      categoriesData?.map(async (category: CategoryData) => {
        await this.repo
          .createQueryBuilder()
          .insert()
          .into(Category)
          .values({ name: category.category })
          .onConflict(`("name") DO NOTHING`)
          .execute();
      }) || [],
    );

    return 'Categories seeded successfully';
  }
}
