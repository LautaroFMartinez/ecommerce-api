import { Category as Categories } from '../../categories/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderDetails } from 'src/modules/orders/entities/orderdetails.entity';

@Entity('products')
export class Products {
  @ApiProperty({
    description: 'Product unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 14 Pro',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with Pro features',
  })
  @Column({ type: 'text', nullable: false })
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
    type: 'number',
    format: 'decimal',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 100,
    minimum: 0,
  })
  @Column({ type: 'int', nullable: false })
  stock: number;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://via.placeholder.com/150',
    default: 'https://via.placeholder.com/150',
  })
  @Column({
    type: 'varchar',
    nullable: false,
    default: 'https://via.placeholder.com/150',
  })
  imgUrl: string;

  @ApiProperty({
    description: 'Product category',
    type: () => Categories,
  })
  @ManyToOne(() => Categories, (category) => category.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Categories;

  @ApiProperty({
    description: 'Order details associated with this product',
    isArray: true,
    type: () => OrderDetails,
  })
  @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
  orderDetails: OrderDetails[];
}
