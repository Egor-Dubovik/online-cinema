import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { MIN_PASS_LENGTH } from 'src/constant/numbers';

export class AuthDto {
	@IsEmail()
	@ApiProperty({ example: 'test@gmail.com' })
	email: string;
	@IsString()
	@MinLength(MIN_PASS_LENGTH, { message: ERROR_MESSAGE.PASS_VALID })
	@ApiProperty({ example: 'test123456', description: 'At list 6 symbols' })
	password: string;
}
