import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { HashingService } from 'src/hashing/hashing.service';
import { UserUpdateDto } from './dto/updateUser.dto';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly hashingService: HashingService,
	) {}

	async byId(_id: string) {
		const user = this.UserModel.findById(_id);
		if (!user) throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
		return user;
	}

	async updateProfile(_id: string, dto: UserUpdateDto, isAdmin = false) {
		const user = await this.byId(_id);
		const isSameUser = await this.UserModel.findOne({ email: dto.email });
		if (isSameUser && String(_id) !== String(isSameUser._id))
			throw new NotFoundException(ERROR_MESSAGE.EMAIL_EXIST);
		if (dto.email) user.email = dto.email;
		if (dto.password) user.password = await this.hashingService.hashPassword(dto.password);
		if ((dto.isAdmin !== undefined && user.isAdmin) || isAdmin) user.isAdmin = dto.isAdmin;
		await user.save();
	}
}
