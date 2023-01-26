import { Module } from '@nestjs/common';
import { SpreadsService } from './spreads.service';
import { SpreadsController } from './spreads.controller';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  controllers: [SpreadsController],
  providers: [SpreadsService, PrismaService]
})
export class SpreadsModule {}
