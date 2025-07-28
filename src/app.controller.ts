import { Controller, Get, Post } from '@nestjs/common';
import { SeederService } from './modules/seeder/seeder.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly seederService: SeederService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'ecommerce-api',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'API information' })
  getRoot(): object {
    return {
      message: 'E-commerce API is running',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        api: '/api',
        docs: '/api/docs',
        'seed-database': '/seed-database',
        'reset-database': '/reset-database',
        'check-database': '/check-database',
      },
    };
  }

  @Post('seed-database')
  @ApiOperation({ summary: 'Manually seed the database' })
  @ApiResponse({ status: 200, description: 'Database seeded successfully' })
  @ApiResponse({ status: 400, description: 'Database already contains data' })
  async seedDatabase(): Promise<object> {
    try {
      const isEmpty = await this.seederService.isDatabaseEmpty();
      if (!isEmpty) {
        return {
          status: 'skipped',
          message:
            'Database already contains data. Use reset-database first if you want to reseed.',
          timestamp: new Date().toISOString(),
        };
      }

      await this.seederService.seedDatabase();
      return {
        status: 'success',
        message: 'Database seeded successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error seeding database',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('reset-database')
  @ApiOperation({ summary: 'Reset and reseed the database' })
  @ApiResponse({
    status: 200,
    description: 'Database reset and seeded successfully',
  })
  async resetAndSeedDatabase(): Promise<object> {
    try {
      await this.seederService.resetDatabase();
      return {
        status: 'success',
        message: 'Database reset and seeded successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error resetting database',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('check-database')
  @ApiOperation({ summary: 'Check if database is empty' })
  @ApiResponse({ status: 200, description: 'Database status' })
  async checkDatabase(): Promise<object> {
    try {
      const isEmpty = await this.seederService.isDatabaseEmpty();
      return {
        status: 'success',
        isEmpty: isEmpty,
        message: isEmpty ? 'Database is empty' : 'Database contains data',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error checking database',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
