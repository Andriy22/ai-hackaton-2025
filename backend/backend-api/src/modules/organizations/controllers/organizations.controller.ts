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
import { Organization, UserRole } from '@prisma/client';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationsService } from '../services/organizations.service';

/**
 * Controller for handling organization-related HTTP requests
 */
@ApiTags('organizations')
@ApiBearerAuth()
@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsController {
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
  async findOrganizationById(@Param('id') id: string): Promise<Organization> {
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
}
