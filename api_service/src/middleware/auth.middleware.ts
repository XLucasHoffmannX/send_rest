import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        try {
            //console.log('request', req.headers.origin)
            const token = req.header("authorization");
            if (!token) return res.status(401).json({ msg: "Autenticação inválida!" })

            jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
                if (err) return res.status(401).json({ msg: "Acesso negado" });
                
                const request : any = req;
                request.user = user;
                //console.log(user);
                next();
            })
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}