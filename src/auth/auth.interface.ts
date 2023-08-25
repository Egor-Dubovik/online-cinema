import { Types } from 'mongoose';

export type TypeRole = 'user' | 'admin' | undefined;

export type TypeUser = {
	user: {
		_id: Types.ObjectId;
		email: string;
		isAdmin: boolean;
	};
	refreshToken: string;
	accessToken: string;
};

export interface TypeTokens {
	refreshToken: string;
	accessToken: string;
}
