import { Body, Injectable, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PrismaService } from 'src/database/PrismaService';
import { randomUUID } from 'crypto';
import { extname } from 'path';

const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    console.log(fileExtName);
    const randomName = randomUUID();
    callback(null, `${name}-${randomName}${fileExtName}`);
};

@Injectable()
export class DocumentsService {
    constructor(private readonly documentRepository: PrismaService) { }

    @Post("/up")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: "./storage/temp",
            })
        })
    )
    async uploadFile(@UploadedFile() file, @Res() res, @Body() data) {
        data.name = file.originalname;
        data.reference = file.filename;
        
        const archiveCreate = await this.documentRepository.document.create({ data });

        return res.json(archiveCreate.id);
    }

}
