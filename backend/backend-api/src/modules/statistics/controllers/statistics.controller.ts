import {
  Controller,
  Get,
  Injectable,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../users/enums/user-role.enum';
import { DailyStatisticsResponseDto } from '../dto/daily-statistics-response.dto';
import { GetDailyStatisticsDto } from '../dto/get-daily-statistics.dto';
import { TotalStatisticsResponseDto } from '../dto/total-statistics-response.dto';
import { StatisticsService } from '../services/statistics.service';

/**
 * Controller for validation statistics operations
 */
@ApiTags('Statistics')
@Controller('statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Injectable()
export class StatisticsController {
  private readonly logger = new Logger(StatisticsController.name);

  /**
   * Constructor for StatisticsController
   * @param statisticsService - Service for statistics operations
   */
  constructor(private readonly statisticsService: StatisticsService) {}

  /**
   * Get daily validation statistics for a specific organization or all organizations
   * @param query - Query parameters for filtering statistics
   * @returns Daily statistics response with data points for each day
   */
  @Get('daily')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({
    summary: 'Get daily validation statistics',
    description:
      'Retrieves daily validation statistics for a specific organization or all organizations',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily validation statistics retrieved successfully',
    type: DailyStatisticsResponseDto,
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
    description: 'Organization ID to filter statistics by',
  })
  async getDailyStatistics(
    @Query() query: GetDailyStatisticsDto,
  ): Promise<DailyStatisticsResponseDto> {
    this.logger.log(
      `Getting daily statistics${
        query.organizationId ? ` for organization ${query.organizationId}` : ''
      } from ${query.startDate.toISOString()} to ${query.endDate.toISOString()}`,
    );

    return this.statisticsService.getDailyStatistics(
      query.organizationId,
      query.startDate,
      query.endDate,
    );
  }

  /**
   * Get total validation statistics for a specific organization or all organizations
   * @param organizationId - Optional organization ID to filter statistics by
   * @returns Total statistics response with counts and success rate
   */
  @Get('total')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({
    summary: 'Get total validation statistics',
    description:
      'Retrieves total validation statistics for a specific organization or all organizations',
  })
  @ApiResponse({
    status: 200,
    description: 'Total validation statistics retrieved successfully',
    type: TotalStatisticsResponseDto,
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
    description: 'Organization ID to filter statistics by',
  })
  async getTotalStatistics(
    @Query('organizationId') organizationId?: string,
  ): Promise<TotalStatisticsResponseDto> {
    this.logger.log(
      `Getting total statistics${
        organizationId ? ` for organization ${organizationId}` : ''
      }`,
    );

    return this.statisticsService.getTotalStatistics(organizationId);
  }
}
