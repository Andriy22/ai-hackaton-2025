import { Injectable } from '@nestjs/common';
import { RetinaImage } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

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
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find a retina image by ID
   * @param id - Retina image ID
   * @returns The retina image with the specified ID or null if not found
   */
  async findById(id: string): Promise<RetinaImage | null> {
    return this.prisma.retinaImage.findUnique({
      where: { id },
    });
  }

  /**
   * Find a retina image by path
   * @param path - Path to the retina image in blob storage
   * @returns The retina image with the specified path or null if not found
   */
  async findByPath(path: string): Promise<RetinaImage | null> {
    return this.prisma.retinaImage.findFirst({
      where: { path },
    });
  }

  /**
   * Delete a retina image
   * @param id - Retina image ID
   * @returns The deleted retina image
   */
  async delete(id: string): Promise<RetinaImage> {
    return this.prisma.retinaImage.delete({
      where: { id },
    });
  }

  /**
   * Delete a retina image by path
   * @param path - Path to the retina image in blob storage
   * @returns The deleted retina image or null if not found
   */
  async deleteByPath(path: string): Promise<RetinaImage | null> {
    const image = await this.findByPath(path);
    if (!image) {
      return null;
    }
    return this.delete(image.id);
  }
}
