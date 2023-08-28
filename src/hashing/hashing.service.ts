import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { SALT_NUM } from 'src/constant/numbers';

@Injectable()
export class HashingService {
	async hashPassword(password: string) {
		const salt = await genSalt(SALT_NUM);
		return hash(password, salt);
	}
}
