import { Types } from 'mongoose';

export type TypeRole = 'user' | 'admin' | undefined;

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
