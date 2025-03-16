import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for total validation statistics response
 */
export class TotalStatisticsResponseDto {
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
   * Total number of successful validations
   */
  @ApiProperty({
    description: 'Total number of successful validations',
    example: 150,
  })
  totalSuccessCount: number;

  /**
   * Total number of unsuccessful validations
   */
  @ApiProperty({
    description: 'Total number of unsuccessful validations',
    example: 30,
  })
  totalFailureCount: number;

  /**
   * Total number of validations
   */
  @ApiProperty({
    description: 'Total number of validations',
    example: 180,
  })
  totalCount: number;

  /**
   * Success rate percentage
   */
  @ApiProperty({
    description: 'Success rate percentage',
    example: 83.33,
  })
  successRate: number;
}
