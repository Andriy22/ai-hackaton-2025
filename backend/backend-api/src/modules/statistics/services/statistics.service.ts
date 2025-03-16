import { Injectable, Logger } from '@nestjs/common';
import { ValidationStatistics } from '../../storage/entities/validation-statistics.entity';
import { ValidationStatisticsService } from '../../storage/services/validation-statistics.service';
import {
  DailyStatisticsDataPointDto,
  DailyStatisticsResponseDto,
} from '../dto/daily-statistics-response.dto';
import { TotalStatisticsResponseDto } from '../dto/total-statistics-response.dto';

/**
 * Service for processing and retrieving validation statistics
 */
@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  /**
   * Constructor for StatisticsService
   * @param validationStatisticsService - Service for validation statistics operations
   */
  constructor(
    private readonly validationStatisticsService: ValidationStatisticsService,
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
}
