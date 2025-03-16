import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { StorageController } from './controllers/storage.controller';
import { ValidationController } from './controllers/validation.controller';
import { RetinaImageRepository } from './repositories/retina-image.repository';
import { ValidationStatisticsRepository } from './repositories/validation-statistics.repository';
import { BlobStorageService } from './services/blob-storage.service';
import { ServiceBusReceiverService } from './services/service-bus-receiver.service';
import { ServiceBusService } from './services/service-bus.service';
import { ValidationReceiverService } from './services/validation-receiver.service';
import { ValidationStatisticsService } from './services/validation-statistics.service';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    OrganizationsModule,
    PrismaModule,
    HttpModule,
  ],
  controllers: [StorageController, ValidationController],
  providers: [
    BlobStorageService,
    RetinaImageRepository,
    ValidationStatisticsRepository,
    ServiceBusService,
    ValidationReceiverService,
    ServiceBusReceiverService,
    ValidationStatisticsService,
  ],
  exports: [BlobStorageService, RetinaImageRepository, ServiceBusService, ValidationStatisticsService],
})
export class StorageModule {}
