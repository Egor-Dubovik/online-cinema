import { Body, Controller, Get, Param, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { IdValidationPipe } from 'src/pipes/idValidation.pipe';
import { User } from './decorators/user.decorator';
import { UserUpdateDto } from './dto/updateUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.userService.byId(_id);
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@Auth()
	async updateProfile(@User('_id') _id: string, @Body() dto: UserUpdateDto) {
		return this.userService.updateProfile(_id, dto);
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@Auth('admin')
	async updateUser(@Param('id', IdValidationPipe) _id: string, @Body() dto: UserUpdateDto) {
		return this.userService.updateProfile(_id, dto, true);
	}
}
