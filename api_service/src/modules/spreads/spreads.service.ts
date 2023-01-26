import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class SpreadsService {
    constructor(private readonly spreadRepository: PrismaService) { }

    async getDocumentService(req: Request, res: Response) {
        try {
            const request: any = req;

            const user = await new PrismaService().user.findFirst({
                where: {
                    id: request.user.id
                }
            });

            const spread = await this.spreadRepository.spread.findMany({
                where: {
                    user_id: user.id
                }
            })

            return res.json(spread);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getDocumentGuard(req: Request, res: Response, document: string) {
        try {
            const request: any = req;

            const user = await new PrismaService().user.findFirst({
                where: {
                    id: request.user.id
                }
            });

            const spread = await this.spreadRepository.spread.findFirst({
                where: {
                    user_id: user.id,
                    document_id: document
                }
            })

            const documentOwner = await this.spreadRepository.document.findFirst({
                where: {
                    id: document,
                    user_id: user.id,
                    user_owner: user.id
                }
            })

            if (documentOwner) {
                return res.json(true)
            }

            if (spread) {
                return res.json(true)
            }

            return res.json(false);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getShareSpread(req: Request, res: Response, idUser: string) {
        try {
            const document = await this.spreadRepository.document.findMany({
                where: {
                    user_id: idUser,
                    user_owner: idUser
                },
                include: {Spread: true}
            })

            return res.json(document);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
