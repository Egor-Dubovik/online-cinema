import {
	Body,
	Controller,
	Get,
	Param,
	Put,
	Query,
	Delete,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { IdValidationPipe } from 'src/pipes/idValidation.pipe';
import { User } from './decorators/user.decorator';
import { UserUpdateDto } from './dto/updateUser.dto';
import { UserModel } from './user.model';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.userService.byId(_id);
	}

	@Get('count')
	@Auth('admin')
	async getCount() {
		return this.userService.getCount();
	}

	@Get()
	@Auth('admin')
	async getUsers(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAll(searchTerm);
	}

	@Get(':id')
	@Auth('admin')
	async getUser(@Param('id') id: string) {
		return this.userService.byId(id);
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

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) _id: string) {
		return this.userService.delete(_id);
	}

	@Get('profile/favorites')
	@Auth()
	async getFavorites(@User('_id') _id: Types.ObjectId) {
		return this.userService.getFavoritesMovies(_id);
	}

	@Put('profile/favorites')
	@Auth()
	async toggleFavorites(
		@Body('movieId', IdValidationPipe) movieId: Types.ObjectId,
		@User() user: UserModel,
	) {
		return this.userService.toggleFavorites(movieId, user);
	}
}
