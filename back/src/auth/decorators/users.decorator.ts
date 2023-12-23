import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const STATUS_KEY = 'status';
export const userStatus = (...status: UserStatus[]) => SetMetadata(STATUS_KEY, status);

// The UserDecorator function returns the request.user object, 
// which is the user object that was set in the request object 
// during the authentication process.
export const getUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
		console.log('user dans le decorator : ', request.user);
		if (data) {
			return request.user[data];
		}
        return request.user;
    },);