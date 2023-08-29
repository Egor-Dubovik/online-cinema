import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export interface GenreModel extends Base {}

export class GenreModel extends TimeStamps {
	@ApiProperty({ example: '603f65ddr5001cvb564e636', description: 'Unique identifier' })
	_id: Types.ObjectId;

	@prop()
	@ApiProperty({ example: 'thriller' })
	name: string;

	@prop()
	@ApiProperty({ example: 'slug' })
	slug: string;

	@prop()
	@ApiProperty({ example: 'Some description.' })
	description: string;

	@prop()
	@ApiProperty({ example: 'Icon path', description: 'Icon path' })
	icon: string;
}
