import { Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

/**
 * Repository for user-related database operations
 */
@Injectable()
export class UsersRepository {
  /**
   * Constructor for UsersRepository
   * @param prisma - The Prisma service for database operations
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user in the database
   * @param data - Data for creating a new user
   * @returns The created user
   */
  async create(data: CreateUserDto & { password: string }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * Find all users in the database
   * @param options - Optional query parameters
   * @returns Array of all users
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
    where?: {
      role?: UserRole;
      email?: string;
    };
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      skip: options?.skip,
      take: options?.take,
      where: options?.where,
    });
  }

  /**
   * Find a user by ID
   * @param id - User ID
   * @returns The user with the specified ID or null if not found
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find a user by email
   * @param email - User email
   * @returns The user with the specified email or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Update a user
   * @param id - User ID
   * @param data - Data for updating the user
   * @returns The updated user
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a user
   * @param id - User ID
   * @returns The deleted user
   */
  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Count users based on optional filter criteria
   * @param where - Optional filter criteria
   * @returns The count of users matching the criteria
   */
  async count(where?: { role?: UserRole }): Promise<number> {
    return this.prisma.user.count({
      where,
    });
  }
}
