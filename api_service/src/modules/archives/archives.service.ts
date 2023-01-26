import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class ArchivesService {
    constructor(private archiveRepository: PrismaService) {}
}
