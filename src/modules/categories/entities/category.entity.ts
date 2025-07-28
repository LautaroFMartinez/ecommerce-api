import { Products } from 'src/modules/products/entities/products.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
}
