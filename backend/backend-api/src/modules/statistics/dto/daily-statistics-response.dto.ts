import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for daily validation statistics data point
 */
export class DailyStatisticsDataPointDto {
  /**
   * Date for the statistics
   */
  @ApiProperty({
    description: 'Date for the statistics',
    example: '2025-01-01',
  })
  date: string;

  /**
   * Number of successful validations
   */
  @ApiProperty({
    description: 'Number of successful validations',
    example: 15,
  })
  successCount: number;

  /**
   * Number of unsuccessful validations
   */
  @ApiProperty({
    description: 'Number of unsuccessful validations',
    example: 3,
  })
  failureCount: number;
}

/**
 * DTO for daily validation statistics response
 */
export class DailyStatisticsResponseDto {
  /**
   * Organization ID for the statistics
   */
  @ApiProperty({
    description: 'Organization ID for the statistics',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  organizationId: string | null;

  /**
   * Array of daily statistics data points
   */
  @ApiProperty({
    description: 'Array of daily statistics data points',
    type: [DailyStatisticsDataPointDto],
  })
  dailyStats: DailyStatisticsDataPointDto[];
}
