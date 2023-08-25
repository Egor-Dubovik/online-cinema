import { Controller, Get, UseGuards } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth('admin')
	async getProfile() {
		return this.userService.byId();
	}
}
