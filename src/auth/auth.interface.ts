import { Types } from 'mongoose';

export interface IUser extends ITokens {
	user: {
		_id: Types.ObjectId;
		email: string;
		isAdmin: boolean;
	};
}

export interface ITokens {
	refreshToken: string;
	accessToken: string;
}
