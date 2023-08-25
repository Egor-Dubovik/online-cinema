import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { UserModel } from 'src/user/user.model';

export class OnlyAdminGuard implements CanActivate {
	constructor(private reflector: Reflector) {}
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<{ user: UserModel }>();
		const user = request.user;
		if (!user.isAdmin) throw new ForbiddenException(ERROR_MESSAGE.NO_RIGHTS);
		return user.isAdmin;
	}
}
