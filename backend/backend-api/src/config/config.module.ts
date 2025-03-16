import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { storageConfig } from './storage.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [storageConfig],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
