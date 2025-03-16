import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { StatisticsController } from './controllers/statistics.controller';
import { StatisticsService } from './services/statistics.service';

/**
 * Module for validation statistics operations
 */
@Module({
  imports: [StorageModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
