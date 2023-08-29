import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export interface ActorModel extends Base {}

export class ActorModel extends TimeStamps {
	@ApiProperty({ example: '64edd3d571b9a982b8e0311c', description: 'Unique identifier' })
	_id: Types.ObjectId;

	@prop()
	@ApiProperty({ example: 'name' })
	name: string;

	@prop({ unique: true })
	@ApiProperty({ example: 'slug' })
	slug: string;

	@prop()
	@ApiProperty({ example: 'photo path' })
	photo: [];
}
