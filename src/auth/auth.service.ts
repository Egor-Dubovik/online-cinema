import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { REFR_TOKEN_DURATION, SUCC_TOKEN_DURATION } from 'src/constant/jwt';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { HashingService } from 'src/hashing/hashing.service';
import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
		private readonly hashingService: HashingService,
	) {}

	async register(dto: AuthDto) {
		const oldUser = await this.UserModel.findOne({ email: dto.email });
		if (oldUser) throw new BadRequestException(ERROR_MESSAGE.EMAIL_EXIST);
		const newUser = await this.createUserInDb(dto);
		const tokens = await this.issueJWTTokenPair(String(newUser._id));
		return { user: this.returnUserFields(newUser), ...tokens };
	}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto);
		const tokens = await this.issueJWTTokenPair(String(user._id));
		return { user: this.returnUserFields(user), ...tokens };
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) throw new UnauthorizedException(ERROR_MESSAGE.LOGIN);
		const result = await this.jwtService.verifyAsync(refreshToken);
		if (!result) throw new UnauthorizedException(ERROR_MESSAGE.NOT_VALID_TOKEN);
		const user = await this.UserModel.findById(result._id);
		const tokens = await this.issueJWTTokenPair(String(user._id));
		return { user: this.returnUserFields(user), ...tokens };
	}

	async validateUser(dto: AuthDto) {
		const user = await this.UserModel.findOne({ email: dto.email });
		if (!user) throw new UnauthorizedException(ERROR_MESSAGE.USER_NOT_FOUND);
		const isValidPassword = await compare(dto.password, user.password);
		if (!isValidPassword) throw new UnauthorizedException(ERROR_MESSAGE.PASSWORD);
		return user;
	}

	async createUserInDb(dto: AuthDto) {
		const newUser = new this.UserModel({
			email: dto.email,
			password: await this.hashingService.hashPassword(dto.password),
		});
		await newUser.save();
		return newUser;
	}

	async issueJWTTokenPair(userId: string) {
		const data = { _id: userId };
		const refreshToken = await this.jwtService.signAsync(data, { expiresIn: REFR_TOKEN_DURATION });
		const accessToken = await this.jwtService.signAsync(data, { expiresIn: SUCC_TOKEN_DURATION });
		return { refreshToken, accessToken };
	}

	returnUserFields(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
			isAdmin: user.isAdmin,
		};
	}
}
