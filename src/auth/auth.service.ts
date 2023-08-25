import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare, genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { SALT_NUM } from 'src/constant/numbers';
import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
	) {}

	async register(dto: AuthDto) {
		const oldUser = await this.UserModel.findOne({ email: dto.email });
		if (oldUser) throw new BadRequestException(ERROR_MESSAGE.EMAIL_EXIST);
		const salt = await genSalt(SALT_NUM);
		const newUser = new this.UserModel({
			email: dto.email,
			password: await hash(dto.password, salt),
		});
		return newUser.save();
	}

	async login(dto: AuthDto) {
		return this.validateUser(dto);
	}

	async validateUser(dto: AuthDto) {
		const user = await this.UserModel.findOne({ email: dto.email });
		if (!user) throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_FOUND);
		const isValidPassword = await compare(dto.password, user.password);
		if (!isValidPassword)
			throw new UnauthorizedException(ERROR_MESSAGE.PASSWORD);
		return user;
	}
}
