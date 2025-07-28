import { Module } from '@nestjs/common';
import { productsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { Users } from './modules/users/entities/users.entity';
import { Category as Categories } from './modules/categories/entities/category.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { FilesModule } from './modules/files/files.module';
import { Products } from './modules/products/entities/products.entity';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { Orders } from './modules/orders/entities/orders.entity';
import { OrderDetails } from './modules/orders/entities/orderdetails.entity';
import { SeederModule } from './modules/seeder/seeder.module';

@Module({
  imports: [
    OrdersModule,
    productsModule,
    UsersModule,
    AuthModule,
    FilesModule,
    SeederModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const typeOrmConfig = configService.get('typeorm');
        if (!typeOrmConfig) {
          throw new Error('TypeORM configuration not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          ...typeOrmConfig,
          entities: [Users, Products, Orders, OrderDetails, Categories],
        };
      },
    }),
    CategoriesModule,
    OrdersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY || 'defaultSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
