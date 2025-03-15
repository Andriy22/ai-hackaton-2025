import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
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
import { Organization, User, UserRole } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AddOrganizationUserDto } from '../dto/add-organization-user.dto';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { UpdateOrganizationUserDto } from '../dto/update-organization-user.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { EmployeeEntity } from '../entities/employee.entity';
import { OrganizationsService } from '../services/organizations.service';

/**
 * Controller for handling organization-related HTTP requests
 */
@ApiTags('organizations')
@ApiBearerAuth()
@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsController {
  private readonly logger = new Logger(OrganizationsController.name);

  /**
   * Constructor for OrganizationsController
   * @param organizationsService - Service for organization-related operations
   */
  constructor(private readonly organizationsService: OrganizationsService) {}

  /**
   * Create a new organization
   * @param createOrganizationDto - Data for creating a new organization
   * @returns The created organization
   */
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Organization has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Organization with this name already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.createOrganization(createOrganizationDto);
  }

  /**
   * Get all organizations with pagination
   * @returns Array of organizations and pagination metadata
   */
  @ApiOperation({ summary: 'Get all organizations with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of organizations per page (default: 10)',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of organizations retrieved successfully',
  })
  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  async findAllOrganizations(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    organizations: Organization[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    return this.organizationsService.findAllOrganizations(
      pageNumber,
      limitNumber,
    );
  }

  /**
   * Find an organization by ID
   * @returns The organization with the specified ID
   */
  @ApiOperation({ summary: 'Find an organization by ID' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization found successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organization not found',
  })
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  async findOrganizationById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Organization> {
    if (user.role !== UserRole.SUPER_ADMIN) {
      const isUserInOrganization =
        await this.organizationsService.checkUserOrganization(id, user.id);
      if (!isUserInOrganization) {
        throw new NotFoundException(
          `You are not a member of this organization`,
        );
      }
    }

    return this.organizationsService.findOrganizationById(id);
  }

  /**
   * Update an organization
   * @returns The updated organization
   */
  @ApiOperation({ summary: 'Update an organization' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: String,
  })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organization not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Organization with this name already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async updateOrganization(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.updateOrganization(
      id,
      updateOrganizationDto,
    );
  }

  /**
   * Delete an organization
   * @returns The deleted organization
   */
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organization not found',
  })
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async deleteOrganization(@Param('id') id: string): Promise<Organization> {
    return this.organizationsService.deleteOrganization(id);
  }

  /**
   * Get users in an organization with pagination
   * @param id - Organization ID
   * @param page - Page number (default: 1)
   * @param limit - Number of users per page (default: 10)
   * @param user - Current authenticated user
   * @returns Array of users and pagination metadata
   */
  @ApiOperation({ summary: 'Get users in an organization with pagination' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: String,
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organization not found',
  })
  @Get(':id/users')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  async getOrganizationUsers(
    @Param('id') id: string,
    @GetUser() user: User,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    users: Omit<User, 'password'>[];
    total: number;
  }> {
    // Check if user has access to this organization
    if (user.role !== UserRole.SUPER_ADMIN) {
      const isUserInOrganization =
        await this.organizationsService.checkUserOrganization(id, user.id);
      if (!isUserInOrganization) {
        throw new NotFoundException(
          `You are not a member of this organization`,
        );
      }
    }

    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    return this.organizationsService.getOrganizationUsers(id, {
      skip,
      take: limitNumber,
    });
  }

  /**
   * Add a user to an organization
   * @param organizationId - Organization ID
   * @param addUserDto - User data to add
   * @returns The updated organization
   */
  @Post(':id/users')
  @ApiOperation({ summary: 'Add a user to an organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiBody({ type: AddOrganizationUserDto })
  @ApiResponse({
    status: 201,
    description: 'User added to organization successfully',
  })
  @ApiResponse({ status: 404, description: 'Organization or user not found' })
  @ApiResponse({
    status: 409,
    description: 'User already belongs to an organization',
  })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  async addUserToOrganization(
    @Param('id') organizationId: string,
    @Body() addUserDto: AddOrganizationUserDto,
    @GetUser() user: User,
  ): Promise<Organization> {
    try {
      // Check if user has access to this organization
      if (user.role !== UserRole.SUPER_ADMIN) {
        const isUserInOrganization =
          await this.organizationsService.checkUserOrganization(
            organizationId,
            user.id,
          );
        if (!isUserInOrganization) {
          throw new NotFoundException(
            `You are not a member of this organization`,
          );
        }
      }

      return await this.organizationsService.addUserToOrganization(
        organizationId,
        addUserDto,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to add user to organization: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  /**
   * Remove a user from an organization
   * @param id - Organization ID
   * @param userId - User ID to remove
   * @param user - Current authenticated user
   * @returns The updated user
   */
  @ApiOperation({ summary: 'Remove a user from an organization' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User removed from organization successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organization or user not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User does not belong to this organization',
  })
  @Delete(':id/users/:userId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  async removeUserFromOrganization(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<User> {
    // Check if user has access to this organization
    if (user.role !== UserRole.SUPER_ADMIN) {
      const isUserInOrganization =
        await this.organizationsService.checkUserOrganization(id, user.id);
      if (!isUserInOrganization) {
        throw new NotFoundException(
          `You are not a member of this organization`,
        );
      }
    }

    return this.organizationsService.removeUserFromOrganization(id, userId);
  }

  /**
   * Update a user's role in an organization
   * @param organizationId - Organization ID
   * @param userId - User ID
   * @param updateUserDto - User role update data
   * @param user - Current authenticated user
   * @returns The updated user
   */
  @Put(':id/users/:userId')
  @ApiOperation({ summary: 'Update a user role in an organization' })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: String,
  })
  @ApiBody({ type: UpdateOrganizationUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User role updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organization or user not found',
  })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  async updateUserRole(
    @Param('id') organizationId: string,
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateOrganizationUserDto,
    @GetUser() user: User,
  ): Promise<User> {
    try {
      // Check if user has access to this organization
      if (user.role !== UserRole.SUPER_ADMIN) {
        const isUserInOrganization =
          await this.organizationsService.checkUserOrganization(
            organizationId,
            user.id,
          );
        if (!isUserInOrganization) {
          throw new NotFoundException(
            `You are not a member of this organization`,
          );
        }
      }

      return await this.organizationsService.updateUserRole(
        organizationId,
        userId,
        updateUserDto,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to update user role: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  /**
   * Create a new employee in an organization
   * @param organizationId - Organization ID
   * @param createEmployeeDto - Employee data
   * @param user - Current authenticated user
   * @returns The created employee
   */
  @Post(':id/employees')
  @ApiOperation({ summary: 'Create a new employee in an organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiBody({ type: CreateEmployeeDto })
  @ApiResponse({
    status: 201,
    description: 'Employee successfully created',
    type: EmployeeEntity,
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async createEmployee(
    @Param('id') organizationId: string,
    @Body() createEmployeeDto: CreateEmployeeDto,
    @GetUser() user: User,
  ): Promise<EmployeeEntity> {
    try {
      // Check if user has access to this organization
      if (user.role !== UserRole.SUPER_ADMIN) {
        const isUserInOrganization =
          await this.organizationsService.checkUserOrganization(
            organizationId,
            user.id,
          );

        if (!isUserInOrganization) {
          throw new NotFoundException(
            `You are not a member of this organization`,
          );
        }
      }

      return await this.organizationsService.createEmployee(
        organizationId,
        createEmployeeDto,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(`Failed to create employee: ${errorMessage}`);
      this.logger.error(errorStack);
      throw error;
    }
  }

  /**
   * Get all employees in an organization
   * @param organizationId - Organization ID
   * @param user - Current authenticated user
   * @returns List of employees
   */
  @Get(':id/employees')
  @ApiOperation({ summary: 'Get all employees in an organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({
    status: 200,
    description: 'List of employees',
    type: [EmployeeEntity],
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getOrganizationEmployees(
    @Param('id') organizationId: string,
    @GetUser() user: User,
  ): Promise<EmployeeEntity[]> {
    try {
      // Check if user has access to this organization
      if (user.role !== UserRole.SUPER_ADMIN) {
        const isUserInOrganization =
          await this.organizationsService.checkUserOrganization(
            organizationId,
            user.id,
          );

        if (!isUserInOrganization) {
          throw new NotFoundException(
            `You are not a member of this organization`,
          );
        }
      }

      return await this.organizationsService.getOrganizationEmployees(
        organizationId,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(`Failed to get employees: ${errorMessage}`);
      this.logger.error(errorStack);
      throw error;
    }
  }

  /**
   * Get an employee by ID
   * @param employeeId - Employee ID
   * @param user - Current authenticated user
   * @returns The employee
   */
  @Get('employees/:employeeId')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  @ApiResponse({
    status: 200,
    description: 'Employee details',
    type: EmployeeEntity,
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async getEmployeeById(
    @Param('employeeId') employeeId: string,
    @GetUser() user: User,
  ): Promise<EmployeeEntity> {
    try {
      const employee =
        await this.organizationsService.getEmployeeById(employeeId);

      // Check if user has access to this organization
      if (user.role !== UserRole.SUPER_ADMIN) {
        const isUserInOrganization =
          await this.organizationsService.checkUserOrganization(
            employee.organizationId,
            user.id,
          );

        if (!isUserInOrganization) {
          throw new NotFoundException(
            `You do not have access to this employee`,
          );
        }
      }

      return employee;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(`Failed to get employee: ${errorMessage}`);
      this.logger.error(errorStack);
      throw error;
    }
  }

  /**
   * Update an employee
   * @param employeeId - Employee ID
   * @param updateEmployeeDto - Employee update data
   * @param user - Current authenticated user
   * @returns The updated employee
   */
  @Patch('employees/:employeeId')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({
    status: 200,
    description: 'Employee successfully updated',
    type: EmployeeEntity,
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async updateEmployee(
    @Param('employeeId') employeeId: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @GetUser() user: User,
  ): Promise<EmployeeEntity> {
    try {
      const employee =
        await this.organizationsService.getEmployeeById(employeeId);

      // Check if user has access to this organization
      if (user.role !== UserRole.SUPER_ADMIN) {
        const isUserInOrganization =
          await this.organizationsService.checkUserOrganization(
            employee.organizationId,
            user.id,
          );

        if (!isUserInOrganization) {
          throw new NotFoundException(
            `You do not have access to this employee`,
          );
        }
      }

      return await this.organizationsService.updateEmployee(
        employeeId,
        updateEmployeeDto,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(`Failed to update employee: ${errorMessage}`);
      this.logger.error(errorStack);
      throw error;
    }
  }

  /**
   * Delete an employee
   * @param employeeId - Employee ID
   * @param user - Current authenticated user
   * @returns The deleted employee
   */
  @Delete('employees/:employeeId')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  @ApiResponse({
    status: 200,
    description: 'Employee successfully deleted',
    type: EmployeeEntity,
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async deleteEmployee(
    @Param('employeeId') employeeId: string,
    @GetUser() user: User,
  ): Promise<EmployeeEntity> {
    try {
      const employee =
        await this.organizationsService.getEmployeeById(employeeId);

      // Check if user has access to this organization
      if (user.role !== UserRole.SUPER_ADMIN) {
        const isUserInOrganization =
          await this.organizationsService.checkUserOrganization(
            employee.organizationId,
            user.id,
          );

        if (!isUserInOrganization) {
          throw new NotFoundException(
            `You do not have access to this employee`,
          );
        }
      }

      return await this.organizationsService.deleteEmployee(employeeId);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(`Failed to delete employee: ${errorMessage}`);
      this.logger.error(errorStack);
      throw error;
    }
  }
}
