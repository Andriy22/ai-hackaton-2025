import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { OrganizationsModule } from '../organizations/organizations.module';
import { StorageController } from './controllers/storage.controller';
import { RetinaImageRepository } from './repositories/retina-image.repository';
import { BlobStorageService } from './services/blob-storage.service';

@Module({
  imports: [ConfigModule, OrganizationsModule],
  controllers: [StorageController],
  providers: [BlobStorageService, RetinaImageRepository, PrismaService],
  exports: [BlobStorageService],
})
export class StorageModule {}
