import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/database/PrismaService';

const editFileName = (req, file, callback) => {
	const name = file.originalname.split('.')[0];
	const fileExtName = extname(file.originalname);
	const randomName = randomUUID();
	callback(null, `${name}-${randomName}${fileExtName}`);
};

const userReferenceStorage = async (req, file, callback) => {
	const user = await new PrismaService().user.findFirst({
		where: {
			id: req.user.id
		}
	});

	console.log(user)
	callback(null, `./storage/private/${user.user_reference}/`)
}

@Controller('documents')
export class DocumentsController {
	constructor(private readonly documentRepository: PrismaService) { }

	@Post("/up")
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: userReferenceStorage,
				filename: editFileName
			})
		})
	)
	async uploadDocument(@UploadedFile() file, @Req() req, @Res() res, @Body() data) {
		try {
			const users = data.users;
			delete data.users;
			data.name = file.originalname;
			data.reference = file.filename;

			const documentCreate = await this.documentRepository.document.create({ data });

			const usersArray = String(users).split(',');

			if (documentCreate.id) {
				for (let user of usersArray) {
					const data = {
						document_id: documentCreate.id,
						user_id: user
					}
					await this.documentRepository.spread.create({ data });
				}
			}

			return res.json(documentCreate.id);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}