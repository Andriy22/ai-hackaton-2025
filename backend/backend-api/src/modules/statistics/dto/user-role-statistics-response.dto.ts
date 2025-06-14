import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for user role statistics data point
 */
export class UserRoleStatisticsDataPointDto {
  @ApiProperty({
    description: 'User role',
    example: 'SUPER_ADMIN',
  })
  role: string;

  @ApiProperty({
    description: 'Number of users with this role',
    example: 5,
  })
  count: number;

  @ApiProperty({
    description: 'Percentage of users with this role',
    example: 25.5,
  })
  percentage: number;
}

/**
 * Data transfer object for user role statistics response
 */
export class UserRoleStatisticsResponseDto {
  @ApiProperty({
    description: 'Array of user role statistics data points',
    type: [UserRoleStatisticsDataPointDto],
  })
  roleStats: UserRoleStatisticsDataPointDto[];

  @ApiProperty({
    description: 'Total number of users',
    example: 20,
  })
  totalUsers: number;
}