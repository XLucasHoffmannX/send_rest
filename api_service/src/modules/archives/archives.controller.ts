import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import * as fs from 'fs';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/database/PrismaService';

const editFileName = (req, file, callback) => {
	const name = file.originalname.split('.')[0];
	const fileExtName = extname(file.originalname);
	console.log(fileExtName);
	const randomName = randomUUID();
	callback(null, `${name}-${randomName}${fileExtName}`);
};

const mkdirLocal = (req, file, callback) => {
	const dir = `./storage/temp`;
	fs.access(dir, (error) => {
		if (error) {
			fs.mkdir(dir, { recursive: true }, (error) => {
				if (error) console.log(error)
				else {
					console.log("Diretório criado!");
					return callback(null, true);
				};
			});
		} else {
			console.log("Diretório existente !");
			return callback(null, true);
		};
	});
};

const mkdirLocalPublic = (req, file, callback) => {
	const dir = `./storage/public`;
	fs.access(dir, (error) => {
		if (error) {
			fs.mkdir(dir, { recursive: true }, (error) => {
				if (error) console.log(error)
				else {
					console.log("Diretório criado!");
					return callback(null, true);
				};
			});
		} else {
			console.log("Diretório existente !");
			return callback(null, true);
		};
	});
};

@Controller('archives')
export class ArchivesController {
	constructor(private readonly archiveRepository: PrismaService) { }

	@Post("/up")
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: "./storage/temp",
				filename: editFileName
			}),
			fileFilter(req, file, callback) {
				mkdirLocal(req, file, callback)
			},
		})
	)
	async uploadFile(@UploadedFile() file, @Res() res, @Body() data) {
		data.name = file.originalname;
		data.reference = file.filename;
		const archiveCreate = await this.archiveRepository.archive.create({ data });

		return res.json(archiveCreate.id);
	}

	@Post("/up-multiple")
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: "./storage/public",
				filename: editFileName
			}),
			fileFilter(req, file, callback) {
				mkdirLocalPublic(req, file, callback)
			},
		})
	)
	async uploadPrivateFile(@UploadedFile() file, @Res() res, @Body() data) {
		data.name = file.originalname;
		data.reference = file.filename;
		data.public = "multiple"
		const archiveCreate = await this.archiveRepository.archive.create({ data });

		return res.json(archiveCreate.id);
	}

	@Get("/down/:origin/:reference")
	async getFileUrlDownload(@Param("reference") reference, @Param("origin") origin, @Res() res) {
		try {
			if (origin !== "temp") {
				if (origin === "multiple") {
					return res.sendFile(`${reference}`, { root: `./storage/public/` })
				}
				return res.sendFile(`${reference}`, { root: `./storage/private/${origin}/` })
			}
			return res.sendFile(`${reference}`, { root: './storage/temp/' })
		} catch (error) {
			throw new HttpException("", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get("/verify/:id")
	async verify(@Param("id") id, @Res() res) {
		try {
			const archive = await this.archiveRepository.archive.findFirst({
				where: {
					id
				}
			});

			if (!archive) {
				const document = await this.archiveRepository.document.findFirst({
					where: {
						id
					}
				})
				if (document) {
					return res.json(document)
				}
				throw new HttpException("Nenhum arquivo ou documento existente!", HttpStatus.BAD_REQUEST);
			}

			res.json(archive)
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get("/get")
	async getAllArchivesUser(@Req() req, @Res() res) {
		try {
			const request: any = req;

			const archives = await this.archiveRepository.archive.findMany({
				where: {
					public: "temp"
				}
			})

			return res.json(archives);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get("/get/restricted")
	async getAllArchivesUserRestricted(@Req() req, @Res() res) {
		try {
			const request: any = req;

			const archives = await this.archiveRepository.archive.findMany({
				where: {
					public: "multiple"
				}
			})

			return res.json(archives);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get("/get/all")
	async getAllDocumentsAndArchives(@Req() req, @Res() res) {
		try {
			const request: any = req;

			const user = await this.archiveRepository.user.findFirst({
				where: {
					id: request.user.id
				}
			});
			
			const archives = await this.archiveRepository.archive.findMany({
				where: {
					user_id : user.id
				},
			})

			const documents = await this.archiveRepository.document.findMany({
				where: {
					user_id : user.id,
					user_owner : user.id
				},
			})

			const response = [];

			for(let doc of documents){
				response.push(doc);
			}

			for(let arch of archives){
				response.push(arch);
			}

			return res.json(response);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
