import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ApiProperty } from '@nestjs/swagger';
import { prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { ActorModel } from 'src/actor/actor.model';
import { GenreModel } from 'src/genre/genre.model';

export interface MovieModel extends Base {}

export class Parameter {
	@prop()
	@ApiProperty({ example: 2023 })
	year: number;

	@prop()
	@ApiProperty({ example: 186 })
	duration: number;

	@prop()
	@ApiProperty({ example: 'USA' })
	country: string;
}

export class MovieModel extends TimeStamps {
	@ApiProperty({ example: '603f650a6fcfc5001564e636', description: 'Unique identifier' })
	_id: Types.ObjectId;

	@prop()
	@ApiProperty({ example: 'poster' })
	poster: string;

	@prop({ unique: true })
	@ApiProperty({ example: 'slug' })
	slug: string;

	@prop()
	@ApiProperty({ example: 'big poster path' })
	bigPoster: string;

	@prop()
	@ApiProperty({ example: 'Spider-Man' })
	title: string;

	@prop()
	@ApiProperty({ example: 'some description' })
	description: string;

	@prop({ default: 0 })
	@ApiProperty({ example: 5, description: 'Movie rating from 0 to 5' })
	rating?: number;

	@prop()
	@ApiProperty({ example: { year: 2023, duration: 144, country: 'Italy' } })
	parameters?: Parameter;

	@prop()
	@ApiProperty({ example: 'https://testvideo.com' })
	videoUrl: string[];

	@prop({ default: 0 })
	@ApiProperty({ example: 5, description: 'How many times has this movie been opened (amount).' })
	countOpened: number;

	@prop({ ref: () => GenreModel })
	@ApiProperty({ example: ['Horror', 'Triller', 'Action', 'Adventure'] })
	genres: Ref<GenreModel>[];

	@prop({ ref: () => ActorModel })
	@ApiProperty({ example: ['Thomas Holland', 'Tom Hardy', 'Will Smith'] })
	actors: Ref<ActorModel>[];

	@prop({ default: false })
	@ApiProperty({ example: false })
	isSendTelegram?: boolean;
}
