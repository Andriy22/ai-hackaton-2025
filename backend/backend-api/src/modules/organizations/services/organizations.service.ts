import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Employee, Organization, User, UserRole } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UsersService } from '../../users/services/users.service';
import { AddOrganizationUserDto } from '../dto/add-organization-user.dto';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { UpdateOrganizationUserDto } from '../dto/update-organization-user.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationsRepository } from '../repositories/organizations.repository';

/**
 * Service for handling organization-related operations
 */
@Injectable()
export class OrganizationsService {
  /**
   * Constructor for OrganizationsService
   * @param organizationsRepository - Repository for organization database operations
   * @param prisma - Prisma service for database operations
   * @param usersService - Service for user-related operations
   */
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create a new organization
   * @param createOrganizationDto - Data for creating a new organization
   * @returns The created organization
   * @throws ConflictException if organization with the same name already exists
   */
  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    // Check if organization with the same name already exists
    const existingOrganization = await this.organizationsRepository.findByName(
      createOrganizationDto.name,
    );
    if (existingOrganization) {
      throw new ConflictException('Organization with this name already exists');
    }

    // Create the organization
    return this.organizationsRepository.create(createOrganizationDto);
  }

  /**
   * Get all organizations with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of organizations per page (default: 10)
   * @returns Array of organizations and pagination metadata
   */
  async findAllOrganizations(
    page = 1,
    limit = 10,
  ): Promise<{
    organizations: Organization[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [organizations, total] = await Promise.all([
      this.organizationsRepository.findAll({
        skip,
        take: limit,
      }),
      this.organizationsRepository.count(),
    ]);

    return {
      organizations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find an organization by ID
   * @param id - Organization ID
   * @returns The organization with the specified ID
   * @throws NotFoundException if organization not found
   */
  async findOrganizationById(id: string): Promise<Organization> {
    const organization = await this.organizationsRepository.findById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }

  /**
   * Get users in an organization with pagination
   * @param organizationId - Organization ID
   * @param options - Optional query parameters
   * @returns Array of users in the organization with total count
   */
  async getOrganizationUsers(
    organizationId: string,
    options?: {
      skip?: number;
      take?: number;
    },
  ): Promise<{
    users: Omit<User, 'password'>[];
    total: number;
  }> {
    const organization =
      await this.organizationsRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`,
      );
    }

    const [users, total] = await Promise.all([
      this.organizationsRepository.getOrganizationUsers(
        organizationId,
        options,
      ),
      this.organizationsRepository.countOrganizationUsers(organizationId),
    ]);

    const usersWithOrgId = users.map((user) => ({
      ...user,
      organizationId,
    }));

    return {
      users: usersWithOrgId,
      total,
    };
  }

  /**
   * Check if a user belongs to an organization
   * @param organizationId - Organization ID
   * @param userId - User ID
   * @returns Boolean indicating if the user belongs to the organization
   */
  async checkUserOrganization(
    organizationId: string,
    userId: string,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true },
    });

    return user?.organizationId === organizationId;
  }

  /**
   * Add a user to an organization
   * @param organizationId - Organization ID
   * @param userData - User data including email, name, and role
   * @returns The updated organization
   */
  async addUserToOrganization(
    organizationId: string,
    userData: AddOrganizationUserDto,
  ): Promise<Organization> {
    const organization =
      await this.organizationsRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`,
      );
    }

    // Check if user with email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      if (existingUser.organizationId) {
        if (existingUser.organizationId === organizationId) {
          throw new ConflictException(
            `User already belongs to this organization`,
          );
        } else {
          throw new ConflictException(
            `User already belongs to another organization`,
          );
        }
      }
    }

    // Create a new user with the provided data
    const newUser = await this.usersService.createUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      role: userData.role || UserRole.ORG_ADMIN,
    });

    // Associate the user with the organization
    return this.organizationsRepository.addUserToOrganization(
      organizationId,
      newUser.id,
    );
  }

  /**
   * Remove a user from an organization
   * @param organizationId - Organization ID
   * @param userId - User ID
   * @returns The removed user
   */
  async removeUserFromOrganization(
    organizationId: string,
    userId: string,
  ): Promise<User> {
    const organization =
      await this.organizationsRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.organizationId !== organizationId) {
      throw new BadRequestException(
        `User does not belong to this organization`,
      );
    }

    // Delete the user from the database
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Update a user's role and information in an organization
   * @param organizationId - Organization ID
   * @param userId - User ID
   * @param updateData - User update data
   * @returns The updated user
   */
  async updateUserRole(
    organizationId: string,
    userId: string,
    updateData: UpdateOrganizationUserDto,
  ): Promise<User> {
    const organization =
      await this.organizationsRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.organizationId !== organizationId) {
      throw new BadRequestException(
        `User does not belong to this organization`,
      );
    }

    // Update user information
    const updateFields: Partial<User> = { role: updateData.role };

    if (updateData.firstName) {
      updateFields.firstName = updateData.firstName;
    }

    if (updateData.lastName) {
      updateFields.lastName = updateData.lastName;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateFields,
    });
  }

  /**
   * Update an organization
   * @param id - Organization ID
   * @param updateOrganizationDto - Data for updating the organization
   * @returns The updated organization
   * @throws NotFoundException if organization not found
   * @throws ConflictException if organization with the updated name already exists
   */
  async updateOrganization(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const existingOrganization =
      await this.organizationsRepository.findById(id);
    if (!existingOrganization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    if (
      updateOrganizationDto.name &&
      updateOrganizationDto.name !== existingOrganization.name
    ) {
      const organizationWithName =
        await this.organizationsRepository.findByName(
          updateOrganizationDto.name,
        );
      if (organizationWithName) {
        throw new ConflictException(
          'Organization with this name already exists',
        );
      }
    }

    return this.organizationsRepository.update(id, updateOrganizationDto);
  }

  /**
   * Delete an organization
   * @param id - Organization ID
   * @returns The deleted organization
   * @throws NotFoundException if organization not found
   */
  async deleteOrganization(id: string): Promise<Organization> {
    const existingOrganization =
      await this.organizationsRepository.findById(id);
    if (!existingOrganization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return this.organizationsRepository.delete(id);
  }

  /**
   * Create a new employee in an organization
   * @param organizationId - Organization ID
   * @param employeeData - Employee data
   * @returns The created employee
   */
  async createEmployee(
    organizationId: string,
    employeeData: CreateEmployeeDto,
  ): Promise<Employee> {
    const organization =
      await this.organizationsRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`,
      );
    }

    return this.organizationsRepository.createEmployee(
      organizationId,
      employeeData,
    );
  }

  /**
   * Get all employees in an organization
   * @param organizationId - Organization ID
   * @returns List of employees
   */
  async getOrganizationEmployees(organizationId: string): Promise<Employee[]> {
    const organization =
      await this.organizationsRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`,
      );
    }

    return this.organizationsRepository.getOrganizationEmployees(
      organizationId,
    );
  }

  /**
   * Get an employee by ID
   * @param employeeId - Employee ID
   * @returns The employee
   */
  async getEmployeeById(employeeId: string): Promise<Employee> {
    const employee =
      await this.organizationsRepository.getEmployeeById(employeeId);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    return employee;
  }

  /**
   * Update an employee
   * @param employeeId - Employee ID
   * @param updateData - Employee update data
   * @returns The updated employee
   */
  async updateEmployee(
    employeeId: string,
    updateData: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee =
      await this.organizationsRepository.getEmployeeById(employeeId);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    return this.organizationsRepository.updateEmployee(employeeId, updateData);
  }

  /**
   * Delete an employee
   * @param employeeId - Employee ID
   * @returns The deleted employee
   */
  async deleteEmployee(employeeId: string): Promise<Employee> {
    const employee =
      await this.organizationsRepository.getEmployeeById(employeeId);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    return this.organizationsRepository.deleteEmployee(employeeId);
  }
}
