import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { OrganizationsController } from './controllers/organizations.controller';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { OrganizationsService } from './services/organizations.service';

/**
 * Module for handling organization-related functionality
 */
@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsRepository],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
