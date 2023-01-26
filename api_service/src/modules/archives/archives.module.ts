import { Module } from '@nestjs/common';
import { ArchivesService } from './archives.service';
import { ArchivesController } from './archives.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [ArchivesController],
  providers: [PrismaService]
})
export class ArchivesModule {}
