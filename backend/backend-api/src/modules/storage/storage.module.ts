import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrganizationsModule } from '../organizations/organizations.module';
import { StorageController } from './controllers/storage.controller';
import { ValidationController } from './controllers/validation.controller';
import { RetinaImageRepository } from './repositories/retina-image.repository';
import { BlobStorageService } from './services/blob-storage.service';
import { ServiceBusService } from './services/service-bus.service';
import { ValidationReceiverService } from './services/validation-receiver.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServiceBusReceiverService } from './services/service-bus-receiver.service';

@Module({
  imports: [EventEmitterModule.forRoot(), OrganizationsModule, PrismaModule],
  controllers: [StorageController, ValidationController],
  providers: [
    BlobStorageService,
    RetinaImageRepository,
    ServiceBusService,
    ValidationReceiverService,
    ServiceBusReceiverService,
  ],
  exports: [BlobStorageService, RetinaImageRepository, ServiceBusService],
})
export class StorageModule {}
