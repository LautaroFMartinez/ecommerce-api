import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Orders } from './orders.entity';
import { Products } from 'src/modules/products/entities/products.entity';

@Entity('orderdetails')
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  price: number;

  @OneToOne(() => Orders, (order) => order.orderDetails)
  order: Orders;

  @ManyToMany(() => Products, (product) => product.orderDetails)
  @JoinTable({
    name: 'orderdetails_products',
    joinColumn: { name: 'orderdetails_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'products_id', referencedColumnName: 'id' },
  })
  products: Products[];
}
