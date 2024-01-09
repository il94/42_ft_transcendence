import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
 
// v1
// @Injectable()
// export class JwtGuard extends AuthGuard('jwt') {
// 	constructor() {
// 	  super();
// 	}
// }

// v2
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	constructor(private readonly jwt: JwtService,) {
	  super();
	}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>();
		const token = request.headers.authorization;
		if (!token) {
		  return false;
		}	
		try {
		  const decoded = this.jwt.verify(token);
		  request['user'] = decoded;	
		  return true;
		} catch (error) {
			console.log("JwtGuard error: ", error);	
		  return false;
		}
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
export class Jwt2faAuthGuard extends AuthGuard('jwt-2fa') {}