import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService,) {
    super({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
		secretOrKey: process.env.JWT_SECRET,
	});
  }
  
  async validate(payload: {sub: number; username: string; }) {
    const user = await this.prisma.user.findUnique({
        where: { id: payload.sub, },
      });
    if (!user)
      throw new NotFoundException(`User with ${payload.sub} does not exist.`);
    delete user.hash;
    delete user.twoFASecret;
    return user;
  }
}

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private prisma: PrismaService,) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         JwtStrategy.extractJWTFromCookie,
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET,
//     });
//   }

//   private static extractJWTFromCookie(req: Request): string | null {
//     console.log("myCookie: ", req)
//     if (req.cookies && req.cookies.myCookie) {
      
//       return req.cookies.myCookie;
//     }
//     return null;
//   }

//   async validate(payload: {sub: number; username: string; }) {
//         const user = await this.prisma.user.findUnique({
//             where: { id: payload.sub, },
//           });
//         if (!user)
//           throw new NotFoundException(`User with ${payload.sub} does not exist.`);
//         delete user.hash;
//         delete user.twoFASecret;
//         return user;
//   }
// }