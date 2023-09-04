import { IsString } from 'class-validator';

export class UpdateCountDto {
	@IsString()
	slug: string;
}
