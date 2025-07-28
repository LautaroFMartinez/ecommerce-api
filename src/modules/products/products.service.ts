import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { UpdateProductDto } from './dto/Products.dto';

@Injectable()
export class productsService {
  constructor(private ProductsRepository: ProductsRepository) {}

  getProducts(page: number = 1, limit: number = 5) {
    return this.ProductsRepository.getProducts(page, limit);
  }

  getProductById(id: string) {
    return this.ProductsRepository.getProductById(id);
  }

  updateProduct(id: string, updateData: UpdateProductDto) {
    return this.ProductsRepository.updateProduct(id, updateData);
  }

  seeder() {
    return this.ProductsRepository.seeder();
  }
}
