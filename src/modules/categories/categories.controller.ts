import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('seeder')
  @ApiOperation({ summary: 'Seed initial categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Categories seeded successfully',
        },
      },
    },
  })
  seed() {
    this.categoriesService.seedCategories();
    return {
      message: 'Categories seeded successfully',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '11111111-1111-1111-1111-111111111111',
          },
          name: {
            type: 'string',
            example: 'Electronics',
          },
        },
      },
    },
  })
  async getAll() {
    return this.categoriesService.getCategories();
  }
}
