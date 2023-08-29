import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

export class Parameter {
	@IsNumber()
	year: number;
	@IsNumber()
	duration: number;
	@IsString()
	country: string;
}

export class MovieDto {
	@IsString()
	poster: string;

	@IsString()
	bigPoster: string;

	@IsString()
	slug: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsObject()
	parameters?: Parameter;

	@IsString()
	videoUrl: string[];

	@IsArray()
	@IsString({ each: true })
	genres: string[];

	@IsArray()
	@IsString({ each: true })
	actors: string[];

	@IsBoolean()
	isSendTelegram?: boolean;
}
