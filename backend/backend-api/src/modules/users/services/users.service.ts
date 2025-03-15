/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';

/**
 * Service for handling user-related operations
 */
@Injectable()
export class UsersService {
  /**
   * Constructor for UsersService
   * @param usersRepository - Repository for user database operations
   */
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Create a new user
   * @param createUserDto - Data for creating a new user
   * @returns The created user without password
   * @throws ConflictException if email already exists
   */
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    // Check if user with email already exists
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Create the user with hashed password
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get all users with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of users per page (default: 10)
   * @param role - Optional role filter
   * @returns Array of users without passwords and pagination metadata
   */
  async findAllUsers(
    page = 1,
    limit = 10,
    role?: UserRole,
  ): Promise<{
    users: Array<Omit<User, 'password'>>;
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;
    const where = role ? { role } : undefined;

    const [users, total] = await Promise.all([
      this.usersRepository.findAll({
        skip,
        take: limit,
        where,
      }),
      this.usersRepository.count(where),
    ]);

    const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);

    return {
      users: usersWithoutPasswords,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find a user by ID
   * @param id - User ID
   * @returns The user without password
   * @throws NotFoundException if user not found
   */
  async findUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Find a user by email
   * @param email - User email
   * @throws NotFoundException if user not found
   */
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Update a user
   * @param id - User ID
   * @param updateUserDto - Data for updating the user
   * @returns The updated user without password
   * @throws NotFoundException if user not found
   * @throws ConflictException if email already exists
   */
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    // Check if user exists
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithEmail = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );
      if (userWithEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password if it's being updated
    let dataToUpdate: UpdateUserDto = { ...updateUserDto };
    if (updateUserDto.password) {
      dataToUpdate = {
        ...dataToUpdate,
        password: await this.hashPassword(updateUserDto.password),
      };
    }

    // Update the user
    const updatedUser = await this.usersRepository.update(id, dataToUpdate);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Delete a user
   * @param id - User ID
   * @returns The deleted user without password
   * @throws NotFoundException if user not found
   */
  async deleteUser(id: string): Promise<Omit<User, 'password'>> {
    // Check if user exists
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Delete the user
    const deletedUser = await this.usersRepository.delete(id);

    const { password, ...userWithoutPassword } = deletedUser;
    return userWithoutPassword;
  }

  /**
   * Validate user credentials
   * @param email - User email
   * @param password - User password
   * @returns The user without password if credentials are valid
   * @throws BadRequestException if credentials are invalid
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    // Find user by email
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await this.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Hash a password
   * @param password - Plain text password
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare a plain text password with a hashed password
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password
   * @returns Whether the passwords match
   */
  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      // Handle or log the error
      console.error('Error comparing passwords:', error);
      return false;
    }
  }
}
