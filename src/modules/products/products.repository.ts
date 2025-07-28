import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Repository } from 'typeorm';
import * as dataJson from '../../data/data.json';
import { Products } from './entities/products.entity';
import { UpdateProductDto } from 'src/modules/products/dto/Products.dto';
const data: ProductSeedData[] = dataJson as ProductSeedData[];
interface ProductSeedData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getProducts(page: number = 1, limit: number = 5): Promise<Products[]> {
    const products = await this.productsRepository.find({
      relations: ['category'],
    });

    let inStock = products.filter((product) => product.stock > 0);

    const start = (page - 1) * limit;
    const end = start + limit;

    inStock = inStock.slice(start, end);
    return inStock;
  }

  async getProductById(id: string): Promise<Products> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async updateProductImage(
    productId: string,
    imgUrl: string,
  ): Promise<boolean> {
    const result = await this.productsRepository.update(productId, { imgUrl });
    return (result.affected ?? 0) > 0;
  }

  async updateProduct(
    id: string,
    updateData: UpdateProductDto,
  ): Promise<Products> {
    await this.getProductById(id);

    if (updateData.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateData.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with id ${updateData.categoryId} not found`,
        );
      }
      updateData.category = category;
      delete updateData.categoryId;
    }

    await this.productsRepository.update(id, updateData);
    return this.getProductById(id);
  }
  async seeder() {
    const categories = await this.categoryRepository.find();
    await Promise.all(
      data?.map(async (cat: ProductSeedData) => {
        const category = categories.find(
          (category) => category.name === cat.category,
        );

        const product = this.productsRepository.create({
          name: cat.name,
          description: cat.description,
          price: cat.price,
          stock: cat.stock,
          category: category,
        });
        await this.productsRepository
          .createQueryBuilder()
          .insert()
          .into(Products)
          .values(product)
          .orIgnore()
          .execute();
      }),
    );
    return 'Products seeded successfully';
  }
}
