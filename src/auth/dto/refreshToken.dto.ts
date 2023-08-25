import { IsString } from 'class-validator';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';

export class RefreshTokenDto {
	@IsString({
		message: ERROR_MESSAGE.TOKEN,
	})
	refreshToken: string;
}
