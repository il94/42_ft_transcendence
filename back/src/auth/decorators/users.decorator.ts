import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);

export const getUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
		if (data) {
			return request.user[data];
		}
        return request.user;
    },);

