import { Injectable, Logger } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ValidationStatistics } from '../../storage/entities/validation-statistics.entity';
import { ValidationStatisticsService } from '../../storage/services/validation-statistics.service';
import { UsersRepository } from '../../users/repositories/users.repository';
import {
  DailyStatisticsDataPointDto,
  DailyStatisticsResponseDto,
} from '../dto/daily-statistics-response.dto';
import { TotalStatisticsResponseDto } from '../dto/total-statistics-response.dto';
import {
  UserRoleStatisticsResponseDto,
  UserRoleStatisticsDataPointDto,
} from '../dto/user-role-statistics-response.dto';

/**
 * Service for processing and retrieving validation statistics
 */
@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  /**
   * Constructor for StatisticsService
   * @param validationStatisticsService - Service for validation statistics operations
   * @param usersRepository - Repository for user database operations
   */
  constructor(
    private readonly validationStatisticsService: ValidationStatisticsService,
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Get daily validation statistics for a specific organization or all organizations
   * @param organizationId - Optional organization ID to filter statistics by
   * @param startDate - Start date for the statistics period
   * @param endDate - End date for the statistics period
   * @returns Daily statistics response with data points for each day
   */
  async getDailyStatistics(
    organizationId: string | undefined,
    startDate: Date,
    endDate: Date,
  ): Promise<DailyStatisticsResponseDto> {
    try {
      // Ensure dates are at the start of the day
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      // Ensure end date is at the end of the day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      // Get all statistics within the date range
      const statistics =
        await this.validationStatisticsService.getStatisticsByDateRange(
          start,
          end,
        );

      // Filter by organization if specified
      const filteredStats = organizationId
        ? statistics.filter((stat) => stat.organizationId === organizationId)
        : statistics;

      // Group statistics by day
      const dailyStatsMap = new Map<
        string,
        { successCount: number; failureCount: number }
      >();

      // Initialize the map with all days in the range
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        dailyStatsMap.set(dateString, {
          successCount: 0,
          failureCount: 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Count successes and failures for each day
      filteredStats.forEach((stat) => {
        const dateString = stat.timestamp.toISOString().split('T')[0];
        const dayStats = dailyStatsMap.get(dateString) || {
          successCount: 0,
          failureCount: 0,
        };

        if (stat.isSuccessful) {
          dayStats.successCount += 1;
        } else {
          dayStats.failureCount += 1;
        }

        dailyStatsMap.set(dateString, dayStats);
      });

      // Convert map to array of data points
      const dailyStats: DailyStatisticsDataPointDto[] = Array.from(
        dailyStatsMap.entries(),
      )
        .map(([date, counts]) => ({
          date,
          successCount: counts.successCount,
          failureCount: counts.failureCount,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date

      return {
        organizationId: organizationId || null,
        dailyStats,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Failed to get daily statistics: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  /**
   * Get daily validation statistics for a specific employee in an organization
   * @param organizationId - Organization ID to filter statistics by
   * @param employeeId - Employee ID to filter statistics by
   * @param startDate - Start date for the statistics period
   * @param endDate - End date for the statistics period
   * @returns Daily statistics response with data points for each day
   */
  async getEmployeeDailyStatistics(
    organizationId: string,
    employeeId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<DailyStatisticsResponseDto> {
    try {
      // Ensure dates are at the start of the day
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      // Ensure end date is at the end of the day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      // Get all statistics within the date range
      const statistics =
        await this.validationStatisticsService.getStatisticsByDateRange(
          start,
          end,
        );

      // Filter by organization and employee
      const filteredStats = statistics.filter(
        (stat) =>
          stat.organizationId === organizationId &&
          stat.employeeId === employeeId,
      );

      // Group statistics by day
      const dailyStatsMap = new Map<
        string,
        { successCount: number; failureCount: number }
      >();

      // Initialize the map with all days in the range
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        dailyStatsMap.set(dateString, {
          successCount: 0,
          failureCount: 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Count successes and failures for each day
      filteredStats.forEach((stat) => {
        const dateString = stat.timestamp.toISOString().split('T')[0];
        const dayStats = dailyStatsMap.get(dateString) || {
          successCount: 0,
          failureCount: 0,
        };

        if (stat.isSuccessful) {
          dayStats.successCount += 1;
        } else {
          dayStats.failureCount += 1;
        }

        dailyStatsMap.set(dateString, dayStats);
      });

      // Convert map to array of data points
      const dailyStats: DailyStatisticsDataPointDto[] = Array.from(
        dailyStatsMap.entries(),
      )
        .map(([date, counts]) => ({
          date,
          successCount: counts.successCount,
          failureCount: counts.failureCount,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date

      return {
        organizationId,
        dailyStats,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Failed to get employee daily statistics: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  /**
   * Get total validation statistics for a specific organization or all organizations
   * @param organizationId - Optional organization ID to filter statistics by
   * @returns Total statistics response with counts and success rate
   */
  async getTotalStatistics(
    organizationId?: string,
  ): Promise<TotalStatisticsResponseDto> {
    try {
      // Get all statistics
      let statistics: ValidationStatistics[] = [];

      if (organizationId) {
        statistics =
          await this.validationStatisticsService.getValidationStatisticsByOrganizationId(
            organizationId,
          );
      } else {
        // Get all successful and failed validations
        const successful =
          await this.validationStatisticsService.getSuccessfulValidations();
        const failed =
          await this.validationStatisticsService.getFailedValidations();
        statistics = [...successful, ...failed];
      }

      // Count successes and failures
      const totalSuccessCount = statistics.filter(
        (stat) => stat.isSuccessful,
      ).length;
      const totalFailureCount = statistics.filter(
        (stat) => !stat.isSuccessful,
      ).length;
      const totalCount = totalSuccessCount + totalFailureCount;

      // Calculate success rate (avoid division by zero)
      const successRate =
        totalCount > 0
          ? parseFloat(((totalSuccessCount / totalCount) * 100).toFixed(2))
          : 0;

      return {
        organizationId: organizationId || null,
        totalSuccessCount,
        totalFailureCount,
        totalCount,
        successRate,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Failed to get total statistics: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  /**
   * Get user role statistics showing distribution of users by role
   * @returns User role statistics response with counts and percentages
   */
  async getUserRoleStatistics(): Promise<UserRoleStatisticsResponseDto> {
    try {
      // Get counts for each role
      const roleValues = Object.values(UserRole);
      const roleCounts = await Promise.all(
        roleValues.map(async (role) => {
          const count = await this.usersRepository.count({ role });
          return { role, count };
        })
      );

      // Calculate total users
      const totalUsers = roleCounts.reduce((sum, { count }) => sum + count, 0);

      // Create role statistics with percentages
      const roleStats: UserRoleStatisticsDataPointDto[] = roleCounts.map(({ role, count }) => ({
        role,
        count,
        percentage: totalUsers > 0 ? parseFloat(((count / totalUsers) * 100).toFixed(2)) : 0,
      }));

      return {
        roleStats,
        totalUsers,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Failed to get user role statistics: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }
}
