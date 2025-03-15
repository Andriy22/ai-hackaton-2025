import { Injectable } from '@nestjs/common';
import { Organization } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';

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
      where: options?.where,
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
    return this.prisma.organization.findUnique({
      where: { id },
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
      where: { name },
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
   * Delete an organization
   * @param id - Organization ID
   * @returns The deleted organization
   */
  async delete(id: string): Promise<Organization> {
    return this.prisma.organization.delete({
      where: { id },
    });
  }

  /**
   * Count organizations based on optional filter criteria
   * @param where - Optional filter criteria
   * @returns The count of organizations matching the criteria
   */
  async count(where?: { name?: string }): Promise<number> {
    return this.prisma.organization.count({
      where,
    });
  }
}
