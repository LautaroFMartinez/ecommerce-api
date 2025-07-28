import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UpdateUserDto,
  UserResponse,
  UserAdminResponse,
  PaginatedUsers,
} from './dto/Users.dto';
import { Users } from './entities/users.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Products } from 'src/modules/products/entities/products.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async saveUser(user: Partial<Users>): Promise<Users> {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  private mapUserToResponse(user: Users): UserResponse {
    console.log('Users orders ', user.orders);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone?.toString() || '',
      country: user.country,
      address: user.address,
      city: user.city,
      orders: (user.orders || []).map((order) => ({
        id: order.id,
      })),
    };
  }

  private mapUserToAdminResponse(user: Users): UserAdminResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone?.toString() || '',
      country: user.country,
      address: user.address,
      city: user.city,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      orders: (user.orders || []).map((order) => ({
        id: order.id,
      })),
    };
  }

  async getUsers(page: number = 1, limit: number = 5): Promise<PaginatedUsers> {
    const skip = (page - 1) * limit;
    const [users, total] = await this.usersRepository.findAndCount({
      skip,
      relations: ['orders'],
      take: limit,
      select: [
        'id',
        'name',
        'email',
        'phone',
        'country',
        'address',
        'city',
        'isAdmin',
        'isActive',
        'orders',
      ],
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map((user) => this.mapUserToAdminResponse(user)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.usersRepository.findOne({
      where: { id, isActive: true },
      relations: [
        'orders',
        'orders.orderDetails',
        'orders.orderDetails.products',
      ],
      select: [
        'id',
        'name',
        'email',
        'phone',
        'country',
        'address',
        'city',
        'orders',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const userResponse = this.mapUserToResponse(user);
    userResponse.orders = (Array.isArray(user.orders) ? user.orders : []).map(
      (order: Order) => ({
        id: order.id,
        orderDetails: order.orderDetails
          ? {
              id: order.orderDetails.id,
              price: Number(order.orderDetails.price),
              products: Array.isArray(order.orderDetails.products)
                ? order.orderDetails.products.map((product: Products) => ({
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    category: product.category
                      ? { id: product.category.id, name: product.category.name }
                      : undefined,
                  }))
                : [],
            }
          : undefined,
      }),
    );

    return userResponse;
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<UserResponse> {
    const existingUser = await this.usersRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.usersRepository.save({
      ...existingUser,
      ...userData,
    });

    return this.mapUserToResponse(updatedUser);
  }

  async deactivateUser(id: string): Promise<{ id: string; message: string }> {
    const user = await this.usersRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${id} not found or already deactivated`,
      );
    }

    const result = await this.usersRepository.update(id, { isActive: false });
    if (!result.affected || result.affected === 0) {
      throw new NotFoundException(
        `User with ID ${id} not found or already deactivated`,
      );
    }

    return {
      id: user.id,
      message: 'User has been successfully deactivated',
    };
  }

  async findByEmail(email: string): Promise<Users | null> {
    return await this.usersRepository.findOne({
      where: { email, isActive: true },
    });
  }
}
