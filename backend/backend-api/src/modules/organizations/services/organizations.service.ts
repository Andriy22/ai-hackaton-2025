import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Organization } from '@prisma/client';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
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
   */
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
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
    // Check if organization exists
    const existingOrganization = await this.organizationsRepository.findById(id);
    if (!existingOrganization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    // Check if name is being updated and if it already exists
    if (
      updateOrganizationDto.name &&
      updateOrganizationDto.name !== existingOrganization.name
    ) {
      const organizationWithName = await this.organizationsRepository.findByName(
        updateOrganizationDto.name,
      );
      if (organizationWithName) {
        throw new ConflictException(
          'Organization with this name already exists',
        );
      }
    }

    // Update the organization
    return this.organizationsRepository.update(id, updateOrganizationDto);
  }

  /**
   * Delete an organization
   * @param id - Organization ID
   * @returns The deleted organization
   * @throws NotFoundException if organization not found
   */
  async deleteOrganization(id: string): Promise<Organization> {
    // Check if organization exists
    const existingOrganization = await this.organizationsRepository.findById(id);
    if (!existingOrganization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    // Delete the organization
    return this.organizationsRepository.delete(id);
  }
}
