import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User, UserRole } from '@prisma/client';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../services/users.service';

/**
 * Controller for handling user-related HTTP requests
 */
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class UsersController {
  /**
   * Constructor for UsersController
   * @param usersService - Service for user-related operations
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   * @param createUserDto - Data for creating a new user
   * @returns The created user without password
   */
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.createUser(createUserDto);
  }

  /**
   * Get all users with pagination
   * @returns Array of users without passwords and pagination metadata
   */
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of users per page (default: 10)',
    type: Number,
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filter users by role',
    enum: UserRole,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users retrieved successfully',
  })
  @Get()
  async findAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: UserRole,
  ): Promise<{
    users: Array<Omit<User, 'password'>>;
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    return this.usersService.findAllUsers(pageNumber, limitNumber, role);
  }

  /**
   * Find a user by ID
   * @returns The user with the specified ID without password
   */
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.usersService.findUserById(id);
  }

  /**
   * Find a user by email
   * @returns The user with the specified email without password
   */
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiQuery({
    name: 'email',
    description: 'User email',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Get('email/find')
  async findUserByEmail(
    @Query('email') email: string,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.findUserByEmail(email);
  }

  /**
   * Update a user
   * @returns The updated user without password
   */
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  /**
   * Delete a user
   * @returns The deleted user without password
   */
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.usersService.deleteUser(id);
  }
}
