import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService,) {

    const extractJwtFromCookie = (req: Request): string | null => {
      let token: string | null = null;
      console.log("req : ", req)
      console.log("cookies : ", req.cookies)

      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }

      return token;
    };

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