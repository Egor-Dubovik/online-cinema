import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { MIN_PASS_LENGTH } from 'src/constant/numbers';

export class UserUpdateDto {
	@IsEmail()
	@IsOptional()
	email?: string;
	@IsString()
	@MinLength(MIN_PASS_LENGTH, { message: ERROR_MESSAGE.PASS_VALID })
	@IsOptional()
	password?: string;
	@IsBoolean()
	@IsOptional()
	isAdmin?: boolean;
}
