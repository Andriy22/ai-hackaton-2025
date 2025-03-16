import { Injectable, Logger } from '@nestjs/common';
import { ValidationStatistics } from '../entities/validation-statistics.entity';
import { ValidationStatisticsRepository } from '../repositories/validation-statistics.repository';

/**
 * Service for managing validation statistics
 */
@Injectable()
export class ValidationStatisticsService {
  private readonly logger = new Logger(ValidationStatisticsService.name);

  /**
   * Constructor for ValidationStatisticsService
   * @param validationStatisticsRepository - Repository for validation statistics operations
   */
  constructor(
    private readonly validationStatisticsRepository: ValidationStatisticsRepository,
  ) {}

  /**
   * Record a successful validation attempt
   * @param organizationId - The ID of the organization
   * @param employeeId - The ID of the matched employee
   * @param similarity - The similarity score of the match
   * @returns The created validation statistics record
   */
  async recordSuccessfulValidation(
    organizationId: string,
    employeeId: string,
    similarity: number,
  ): Promise<ValidationStatistics> {
    try {
      return await this.validationStatisticsRepository.create({
        organizationId,
        employeeId,
        timestamp: new Date(),
        isSuccessful: true,
        similarity,
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to record successful validation: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Record a failed validation attempt
   * @param organizationId - The ID of the organization
   * @returns The created validation statistics record
   */
  async recordFailedValidation(
    organizationId: string,
  ): Promise<ValidationStatistics> {
    try {
      return await this.validationStatisticsRepository.create({
        organizationId,
        timestamp: new Date(),
        isSuccessful: false,
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to record failed validation: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get validation statistics for an organization
   * @param organizationId - The ID of the organization
   * @returns Array of validation statistics for the organization
   */
  async getValidationStatisticsByOrganizationId(
    organizationId: string,
  ): Promise<ValidationStatistics[]> {
    try {
      return await this.validationStatisticsRepository.findByOrganizationId(
        organizationId,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to get statistics by organization: ${error.message}`,
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
  async getStatisticsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ValidationStatistics[]> {
    try {
      return await this.validationStatisticsRepository.findByDateRange(
        startDate,
        endDate,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to get statistics by date range: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get successful validation statistics
   * @returns Array of successful validation statistics
   */
  async getSuccessfulValidations(): Promise<ValidationStatistics[]> {
    try {
      return await this.validationStatisticsRepository.findSuccessful();
    } catch (error: any) {
      this.logger.error(
        `Failed to get successful validations: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get failed validation statistics
   * @returns Array of failed validation statistics
   */
  async getFailedValidations(): Promise<ValidationStatistics[]> {
    try {
      return await this.validationStatisticsRepository.findFailed();
    } catch (error: any) {
      this.logger.error(
        `Failed to get failed validations: ${error.message}`,
      );
      throw error;
    }
  }
}
