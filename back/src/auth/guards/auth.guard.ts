import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	constructor() {
	  super();
	}
}

@Injectable()
export class Api42AuthGuard extends AuthGuard('42') {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const activate = (await super.canActivate(context)) as boolean;
		const request = context.switchToHttp().getRequest();
		await super.logIn(request);
		return activate; 
	}
}

@Injectable()
export class TwoFAGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let user: any;
   // if (context.getType<ContextType | 'graphql'>() === 'graphql') {
   //   user = GqlExecutionContext.create(context).getContext().req.user;
   // } else {
      user = context.switchToHttp().getRequest().user;
   // }
    if (!user) throw new UnauthorizedException();
    return true;
  }
}