import { Users } from 'src/modules/users/entities/users.entity';
import { OrderDetails } from './orderdetails.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, (user) => user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order, {
    cascade: true,
  })
  @JoinColumn({ name: 'order_details_id' })
  orderDetails: OrderDetails;
}
