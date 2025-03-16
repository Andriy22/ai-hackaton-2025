import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ValidationStatistics } from '../entities/validation-statistics.entity';

/**
 * Repository for managing validation statistics
 */
@Injectable()
export class ValidationStatisticsRepository {
  private readonly logger = new Logger(ValidationStatisticsRepository.name);

  /**
   * Constructor for ValidationStatisticsRepository
   * @param prisma - The Prisma service for database operations
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new validation statistics record
   * @param data - The validation statistics data to create
   * @returns The created validation statistics record
   */
  async create(
    data: Omit<ValidationStatistics, 'id'>,
  ): Promise<ValidationStatistics> {
    try {
      return await this.prisma.validationStatistics.create({
        data: {
          organizationId: data.organizationId,
          employeeId: data.employeeId,
          timestamp: data.timestamp,
          isSuccessful: data.isSuccessful,
          similarity: data.similarity,
        },
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to create validation statistics: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get validation statistics for an organization
   * @param organizationId - The ID of the organization
   * @returns Array of validation statistics for the organization
   */
  async findByOrganizationId(
    organizationId: string,
  ): Promise<ValidationStatistics[]> {
    try {
      return await this.prisma.validationStatistics.findMany({
        where: {
          organizationId,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to find validation statistics: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get validation statistics for a specific time period
   * @param startDate - The start date of the period
   * @param endDate - The end date of the period
   * @returns Array of validation statistics for the time period
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ValidationStatistics[]> {
    try {
      return await this.prisma.validationStatistics.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to find validation statistics by date range: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get successful validation statistics
   * @returns Array of successful validation statistics
   */
  async findSuccessful(): Promise<ValidationStatistics[]> {
    try {
      return await this.prisma.validationStatistics.findMany({
        where: {
          isSuccessful: true,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to find successful validation statistics: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get failed validation statistics
   * @returns Array of failed validation statistics
   */
  async findFailed(): Promise<ValidationStatistics[]> {
    try {
      return await this.prisma.validationStatistics.findMany({
        where: {
          isSuccessful: false,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to find failed validation statistics: ${error.message}`,
      );
      throw error;
    }
  }
}
