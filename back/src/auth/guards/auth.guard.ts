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

// export class JwtGuard implements CanActivate {
// 	constructor(private jwtService: JwtService) {
  
// 	}
// 	async canActivate(
// 	  context: ExecutionContext,
// 	): Promise<boolean> {
// 	  const request = context.switchToHttp().getRequest();
// 	  const token = this.extractTokenFromHeader(request);
// 	  if (!token) {
// 		throw new UnauthorizedException();
// 	  }
// 	  try {
// 		const payload = await this.jwtService.verifyAsync(
// 		  token,
// 		  {
// 			secret: process.env.JWT_SECRET
// 		  }
// 		);
// 		// 💡 We're assigning the payload to the request object here
// 		// so that we can access it in our route handlers
// 		request['user'] = payload;
// 	  } catch {
// 		throw new UnauthorizedException();
// 	  }
// 	  return true;
// 	}
  
// 	private extractTokenFromHeader(request: Request): string | undefined {
// 	  const [type, token] = request.headers['authorization']?.split(' ') ?? [];
// 	  return type === 'Bearer' ? token : undefined;
// 	}
//   }