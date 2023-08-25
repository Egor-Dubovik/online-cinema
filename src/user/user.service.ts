import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
	constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) {}

	async byId(_id: string) {
		const user = this.UserModel.findById(_id);
		if (!user) throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
		return user;
	}
}
