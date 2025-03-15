import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';

/**
 * Module for user-related functionality
 */
@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
