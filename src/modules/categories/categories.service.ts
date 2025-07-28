import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoryRepository) {}

  async seedCategories() {
    await this.repo.addCategories();
  }

  getCategories() {
    return this.repo.getCategories();
  }
}
