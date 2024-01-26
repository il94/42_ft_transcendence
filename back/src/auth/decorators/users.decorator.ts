import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';

export const getUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
		if (data) {
			return request.user[data];
		}
        return request.user;
    },);
