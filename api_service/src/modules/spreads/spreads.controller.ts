import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { SpreadsService } from './spreads.service';
import { PrismaService } from 'src/database/PrismaService';

@Controller('spreads')
export class SpreadsController {
	constructor(private readonly spreadsService: SpreadsService) { }

	@Get()
	getDocuments(@Req() req, @Res() res) {
		return this.spreadsService.getDocumentService(req, res);
	}

	@Get("/guard/:document")
	getDocumentGuard(@Req() req, @Res() res, @Param('document') document){
		return this.spreadsService.getDocumentGuard(req, res, document);
	}

	@Get("/shared/:id")
	getShareSpread(@Req() req, @Res() res, @Param("id") idUser){
		return this.spreadsService.getShareSpread(req, res, idUser);
	}
}
