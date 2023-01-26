import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAccessDTO, UserDTO } from './user.dto';

@Controller('/access/user')
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Post('/register')
	async register(@Body() data: UserDTO) {
		return await this.userService.registerUser(data);
	}

	@Post()
	async access(@Body() data: UserAccessDTO, @Res() res){
		const result = await this.userService.access(data);

		res.cookie('refresh', result.refresh, {
			httpOnly: true,
			path: '/access/user/refresh'
		});
		
		return await res.json({accessToken: result.access});
	}

	@Get('/refresh')
	async refresh(@Req() req, @Res() res){
		return await this.userService.refreshToken(req, res);
	}

	@Get('/logout')
	async logout(@Req() req, @Res() res){
		return await this.userService.logout(req, res);
	}

	@Put('/edit/:id')
	async update(@Param('id') id: string, @Body() data:UserDTO){
		return await this.userService.updateUser(id, data);
	}

	@Delete('/delete/:id')
	async delete(@Param('id') id: string){
		return await this.userService.deleteUser(id);
	}

	@Get('/auth')
	async getUser(@Req() req, @Res() res){
		return await this.userService.getUser(req, res);
	}

	@Get('/all')
	async getAllUsers(){
		return await this.userService.getAllUsers();
	}

	@Get("/get/:id")
	async getAllById(@Param("id") idUser){
		return await this.userService.getUserById(idUser);
	}
}
