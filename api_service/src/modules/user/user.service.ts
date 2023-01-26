import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { UserAccessDTO, UserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import * as fs from 'fs';

@Injectable()
export class UserService {
	constructor(private userRepository: PrismaService) { }

	createToken(userId?: String) {
		return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN, { expiresIn: "7d" });
	}

	createRefreshToken(userId?: String) {
		return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
	}

	async registerUser(data: UserDTO) {
		try {
			if (!(data.name || data.email || data.password)) {
				throw new HttpException("Erro falta de parâmetros!", HttpStatus.BAD_REQUEST);
			}
			const usernameExists = await this.userRepository.user.findFirst({
				where: {
					name: data.name
				}
			});

			const useremailExists = await this.userRepository.user.findFirst({
				where: {
					email: data.email
				}
			});

			if (usernameExists || useremailExists) {
				throw new HttpException("Esse nome ou email de usuário já existe!", HttpStatus.BAD_REQUEST);
			}

			if (data.password.length < 6) {
				throw new HttpException("Erro a senha deve conter 6 ou mais caracteres!", HttpStatus.BAD_REQUEST);
			}

			const passwordEncrypt = await bcrypt.hash(data.password, 10);
			if (!passwordEncrypt) {
				throw new HttpException("Encrypt error!", HttpStatus.INTERNAL_SERVER_ERROR);
			}

			data.password = passwordEncrypt;
			data.user_reference = `${data.name}_${randomUUID()}`;

			// criar a pasta
			const dir = `./storage/private/${data.user_reference}`;
			fs.access(dir, (error) => {
				if (error) {
					fs.mkdir(dir, { recursive: true }, async (error) => {
						if (error) {
							console.log("Nao foi possivel criar")
							console.log(error)
							return new HttpException("Erro na criaçao do diretorio do usuário!", HttpStatus.INTERNAL_SERVER_ERROR);
						}
						else {
							console.log(`Diretório para ${data.name} criado!`);
							const usercreate = await this.userRepository.user.create({
								data
							});
							return usercreate;
						};
					});
				} else {
					console.log("Diretório existente !");
					return
				};
			});
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async access(data: UserAccessDTO) {
		try {
			if (!(data.name || data.password)) {
				throw new HttpException("Erro faltas de parâmetros!", HttpStatus.BAD_REQUEST);
			}

			const user = await this.userRepository.user.findFirst({
				where: {
					name: data.name
				}
			});

			if (!user) {
				throw new HttpException("Nome de usuário ou senha incorretos!", HttpStatus.BAD_REQUEST);
			}

			const passwordConfirm = await bcrypt.compare(data.password, user.password);

			if (!passwordConfirm) {
				throw new HttpException("Nome de usuário ou senha incorretos!", HttpStatus.BAD_REQUEST);
			}

			// tokens
			const accessToken = this.createToken(user.id)
			const refreshToken = this.createRefreshToken(user.id)

			return {
				access: accessToken,
				refresh: refreshToken
			};
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async refreshToken(req: Request, res: Response) {
		try {

			if (!req.headers.cookie.includes('refresh')) return res.status(400).json({ msg: "Por favor realize o login ou se cadastre!" });

			const tokenCookie: any = req.headers.cookie.valueOf().replace('refresh=', '');

			jwt.verify(tokenCookie, process.env.REFRESH_TOKEN, (err, user) => {
				if (err) return res.status(400).json({ msg: "Acesso negado!" });

				const accessToken = this.createToken(user)
				res.json({ accessToken })
			})
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async logout(req: Request, res: Response) {
		try {
			res.clearCookie('refresh', { path: "/access/user/refresh" })

			res.json();
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async updateUser(id: string, data: UserDTO) {
		try {
			if (!(data.name || data.email || data.password)) {
				throw new HttpException("Erro falta de parâmetros!", HttpStatus.BAD_REQUEST);
			}

			const userExists = await this.userRepository.user.findUnique({
				where: {
					id
				}
			});

			if (!userExists) {
				throw new HttpException("Usuário inexistente!", HttpStatus.BAD_REQUEST);
			}

			return await this.userRepository.user.update({
				data,
				where: {
					id
				}
			})
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteUser(id: string) {
		const userExists = await this.userRepository.user.findUnique({
			where: {
				id
			}
		});

		if (!userExists) {
			throw new HttpException("Usuário inexistente!", HttpStatus.INTERNAL_SERVER_ERROR);

		}

		return await this.userRepository.user.delete({
			where: {
				id
			}
		});
	}

	async getUser(req: Request, res: Response) {
		try {
			const request: any = req;

			const user = await this.userRepository.user.findFirst({
				where: {
					id: request.user.id
				}
			});

			delete user.password;

			return res.json(user);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	async getAllUsers() {
		try {
			const users = await this.userRepository.user.findMany();

			return users;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async getUserById(idUser: string) {
		try {
			const user = await this.userRepository.user.findFirst({
				where:{
					id: idUser
				}
			})

			delete user.password;

			return user;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
