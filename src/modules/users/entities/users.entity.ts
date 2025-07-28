import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
import { Orders } from 'src/modules/orders/entities/orders.entity';

@Entity('users')
export class Users {
  @ApiProperty({
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @ApiProperty({
    description: 'User password (hashed)',
    maxLength: 80,
  })
  @Column({ type: 'varchar', length: 80, nullable: false })
  password: string;

  @ApiProperty({
    description: 'User phone number',
    example: '1234567890',
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    description: 'User country',
    example: 'Argentina',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @ApiProperty({
    description: 'User address',
    example: '123 Main Street',
  })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({
    description: 'User city',
    example: 'Buenos Aires',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @ApiProperty({
    description: 'Whether user has admin privileges',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ApiProperty({
    description: 'Whether user account is active',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'User orders',
    type: () => [Orders],
  })
  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];
}
