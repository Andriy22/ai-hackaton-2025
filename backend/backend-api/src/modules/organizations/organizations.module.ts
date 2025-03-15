import { Module } from '@nestjs/common';
import { OrganizationsController } from './controllers/organizations.controller';
import { OrganizationsService } from './services/organizations.service';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { PrismaModule } from '../../prisma/prisma.module';

/**
 * Module for handling organization-related functionality
 */
@Module({
  imports: [PrismaModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsRepository],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
