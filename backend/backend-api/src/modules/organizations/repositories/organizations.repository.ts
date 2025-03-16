import { Injectable } from '@nestjs/common';
import { Organization, User, UserRole, Employee } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  excludeDeleted,
  softDeleteData,
} from '../../../common/utils/soft-delete.util';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

/**
 * Repository for organization-related database operations
 */
@Injectable()
export class OrganizationsRepository {
  /**
   * Constructor for OrganizationsRepository
   * @param prisma - The Prisma service for database operations
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new organization in the database
   * @param data - Data for creating a new organization
   * @returns The created organization
   */
  async create(data: CreateOrganizationDto): Promise<Organization> {
    return this.prisma.organization.create({
      data,
    });
  }

  /**
   * Find all organizations in the database
   * @param options - Optional query parameters
   * @returns Array of all organizations
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
    where?: {
      name?: string;
    };
  }): Promise<Organization[]> {
    return this.prisma.organization.findMany({
      skip: options?.skip,
      take: options?.take,
      where: excludeDeleted(options?.where),
      include: {
        _count: {
          select: {
            users: true,
            employees: true,
          },
        },
      },
    });
  }

  /**
   * Find an organization by ID
   * @param id - Organization ID
   * @returns The organization with the specified ID or null if not found
   */
  async findById(id: string): Promise<Organization | null> {
    return this.prisma.organization.findFirst({
      where: excludeDeleted({ id }),
      include: {
        _count: {
          select: {
            users: true,
            employees: true,
          },
        },
      },
    });
  }

  /**
   * Find an organization by name
   * @param name - Organization name
   * @returns The organization with the specified name or null if not found
   */
  async findByName(name: string): Promise<Organization | null> {
    return this.prisma.organization.findFirst({
      where: excludeDeleted({ name }),
    });
  }

  /**
   * Update an organization
   * @param id - Organization ID
   * @param data - Data for updating the organization
   * @returns The updated organization
   */
  async update(id: string, data: UpdateOrganizationDto): Promise<Organization> {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  /**
   * Soft delete an organization
   * @param id - Organization ID
   * @returns The soft-deleted organization
   */
  async delete(id: string): Promise<Organization> {
    return this.prisma.organization.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  /**
   * Count organizations based on optional filter criteria
   * @param where - Optional filter criteria
   * @returns The count of organizations matching the criteria
   */
  async count(where?: { name?: string }): Promise<number> {
    return this.prisma.organization.count({
      where: excludeDeleted(where),
    });
  }

  /**
   * Check if user belongs to the organization
   * @param id - Organization ID
   * @param userId - User ID
   * @returns True if user belongs to the organization, false otherwise
   */
  async checkUserOrganization(id: string, userId: string): Promise<boolean> {
    return (
      (await this.prisma.organization.findFirst({
        where: excludeDeleted({
          id,
          users: {
            some: {
              id: userId,
              deleted: false,
            },
          },
        }),
      })) !== null
    );
  }

  /**
   * Get users in an organization with pagination
   * @param organizationId - Organization ID
   * @param options - Optional query parameters
   * @returns Array of users in the organization
   */
  async getOrganizationUsers(
    organizationId: string,
    options?: {
      skip?: number;
      take?: number;
    },
  ) {
    return this.prisma.user.findMany({
      where: excludeDeleted({
        organizationId,
      }),
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: options?.skip,
      take: options?.take,
    });
  }

  /**
   * Count users in an organization
   * @param organizationId - Organization ID
   * @returns The count of users in the organization
   */
  async countOrganizationUsers(organizationId: string): Promise<number> {
    return this.prisma.user.count({
      where: excludeDeleted({
        organizationId,
      }),
    });
  }

  /**
   * Add a user to an organization
   * @param organizationId - Organization ID
   * @param userId - User ID
   * @returns Updated organization
   */
  async addUserToOrganization(
    organizationId: string,
    userId: string,
  ): Promise<Organization> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { organizationId },
    });
    const organization = await this.findById(organizationId);
    if (!organization) {
      throw new Error(`Organization with ID ${organizationId} not found`);
    }
    return organization;
  }

  /**
   * Remove a user from an organization
   * @param userId - User ID
   * @returns Updated user
   */
  async removeUserFromOrganization(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { organizationId: null },
    });
  }

  /**
   * Update a user's role in an organization
   * @param userId - User ID
   * @param role - New role
   * @returns Updated user
   */
  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
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
    return this.prisma.employee.create({
      data: {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        birthDate: new Date(employeeData.birthDate),
        position: employeeData.position,
        organization: {
          connect: { id: organizationId },
        },
      },
    });
  }

  /**
   * Get all employees in an organization
   * @param organizationId - Organization ID
   * @param options - Optional query parameters
   * @returns List of employees
   */
  async getOrganizationEmployees(
    organizationId: string,
    options?: {
      skip?: number;
      take?: number;
    },
  ): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: excludeDeleted({ organizationId }),
      skip: options?.skip,
      take: options?.take,
      orderBy: {
        lastName: 'asc',
      },
    });
  }

  /**
   * Count employees in an organization
   * @param organizationId - Organization ID
   * @returns The count of employees in the organization
   */
  async countOrganizationEmployees(organizationId: string): Promise<number> {
    return this.prisma.employee.count({
      where: excludeDeleted({ organizationId }),
    });
  }

  /**
   * Get an employee by ID
   * @param employeeId - Employee ID
   * @returns The employee
   */
  async getEmployeeById(employeeId: string): Promise<Employee | null> {
    return this.prisma.employee.findFirst({
      where: excludeDeleted({ id: employeeId }),
    });
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
    const updateFields: Partial<Employee> = {};

    if (updateData.firstName) {
      updateFields.firstName = updateData.firstName;
    }

    if (updateData.lastName) {
      updateFields.lastName = updateData.lastName;
    }

    if (updateData.birthDate) {
      updateFields.birthDate = new Date(updateData.birthDate);
    }

    if (updateData.position) {
      updateFields.position = updateData.position;
    }

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: updateFields,
    });
  }

  /**
   * Soft delete an employee
   * @param employeeId - Employee ID
   * @returns The soft-deleted employee
   */
  async deleteEmployee(employeeId: string): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id: employeeId },
      data: softDeleteData(),
    });
  }
}
