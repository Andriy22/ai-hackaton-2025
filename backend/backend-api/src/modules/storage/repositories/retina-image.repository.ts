import { Injectable } from '@nestjs/common';
import { RetinaImage } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  excludeDeleted,
  softDeleteData,
} from '../../../common/utils/soft-delete.util';

/**
 * Repository for retina image-related database operations
 */
@Injectable()
export class RetinaImageRepository {
  /**
   * Constructor for RetinaImageRepository
   * @param prisma - The Prisma service for database operations
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new retina image record in the database
   * @param employeeId - ID of the employee
   * @param path - Path to the retina image in blob storage
   * @returns The created retina image record
   */
  async create(employeeId: string, path: string): Promise<RetinaImage> {
    return this.prisma.retinaImage.create({
      data: {
        path,
        employee: {
          connect: { id: employeeId },
        },
      },
    });
  }

  /**
   * Find all retina images for an employee
   * @param employeeId - ID of the employee
   * @returns Array of retina images for the employee
   */
  async findByEmployeeId(employeeId: string): Promise<RetinaImage[]> {
    return this.prisma.retinaImage.findMany({
      where: excludeDeleted({ employeeId }),
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find a retina image by ID
   * @param id - Retina image ID
   * @returns The retina image with the specified ID or null if not found
   */
  async findById(id: string): Promise<RetinaImage | null> {
    return this.prisma.retinaImage.findFirst({
      where: excludeDeleted({ id }),
    });
  }

  /**
   * Find a retina image by path
   * @param path - Path to the retina image in blob storage
   * @returns The retina image with the specified path or null if not found
   */
  async findByPath(path: string): Promise<RetinaImage | null> {
    return this.prisma.retinaImage.findFirst({
      where: excludeDeleted({ path }),
    });
  }

  /**
   * Soft delete a retina image
   * @param id - Retina image ID
   * @returns The soft-deleted retina image
   */
  async delete(id: string): Promise<RetinaImage> {
    return this.prisma.retinaImage.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  /**
   * Soft delete a retina image by path
   * @param path - Path to the retina image in blob storage
   * @returns The soft-deleted retina image or null if not found
   */
  async deleteByPath(path: string): Promise<RetinaImage | null> {
    const image = await this.findByPath(path);
    if (!image) {
      return null;
    }
    return this.delete(image.id);
  }

  /**
   * Update a retina image with document ID
   * @param imgId - Retina image ID
   * @param documentId - Cosmos DB document ID
   * @returns The updated retina image or null if not found
   */
  async updateDocumentId(
    imgId: string,
    documentId: string,
  ): Promise<RetinaImage | null> {
    try {
      return this.prisma.retinaImage.update({
        where: { id: imgId },
        data: {
          documentId,
          processedAt: new Date(),
        },
      });
    } catch {
      // If the record doesn't exist, return null
      return null;
    }
  }

  /**
   * Find retina images by organization ID
   * @param organizationId - Organization ID to find images for
   * @returns Array of retina images for the organization
   */
  async findByOrganizationId(organizationId: string): Promise<RetinaImage[]> {
    return this.prisma.retinaImage.findMany({
      where: excludeDeleted({
        employee: {
          organizationId,
          deleted: false,
        },
      }),
      include: {
        employee: true,
      },
    });
  }
}
