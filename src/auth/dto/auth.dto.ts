import { IsString, IsEmail, MinLength } from 'class-validator';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { MIN_PASS_LENGTH } from 'src/constant/numbers';

export class AuthDto {
	@IsEmail()
	email: string;
	@IsString()
	@MinLength(MIN_PASS_LENGTH, { message: ERROR_MESSAGE.PASS_VALID })
	password: string;
}
