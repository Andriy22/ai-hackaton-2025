import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for getting daily validation statistics for a specific employee
 */
export class GetEmployeeDailyStatisticsDto {
  /**
   * Organization ID to filter statistics by
   */
  @ApiProperty({
    description: 'Organization ID to filter statistics by',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  organizationId: string;

  /**
   * Employee ID to filter statistics by
   */
  @ApiProperty({
    description: 'Employee ID to filter statistics by',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  employeeId: string;

  /**
   * Start date for the statistics period
   */
  @ApiProperty({
    description: 'Start date for the statistics period',
    example: '2025-01-01',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  /**
   * End date for the statistics period
   */
  @ApiProperty({
    description: 'End date for the statistics period',
    example: '2025-01-31',
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
