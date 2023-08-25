import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@ApiProperty({ example: '603f650a6fcfc5001564e636', description: 'Unique identifier' })
	_id: Types.ObjectId;

	@prop({ unique: true })
	@ApiProperty({ example: 'test@gmail.com', description: 'Correct email' })
	email: string;

	@prop()
	@ApiProperty({ example: 'test123456', description: 'At list 6 symbols' })
	password: string;

	@prop({ default: false })
	@ApiProperty({ example: 'false', description: 'Boolean value' })
	isAdmin?: boolean;

	@prop({ default: [] })
	favorites?: [];
}
