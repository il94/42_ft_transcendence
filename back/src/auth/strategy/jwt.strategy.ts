import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService,) {

    // const extractJwtFromCookie = (req) => {
    //   let token = null;
    //   if (req && req.cookies) {
    //     token = req.cookies['access_token'];
    //   }
    //   return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    // };

    super({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
		secretOrKey: process.env.JWT_SECRET,
	});
  }
  
  async validate(payload: {sub: number; username: string; }) {
    console.log("payload: ", payload)
    const user = await this.prisma.user.findUnique({
        where: { id: payload.sub, },
      });
    if (!user)
      throw new NotFoundException(`User with ${payload.sub} does not exist.`);
    delete user.hash;
    delete user.twoFASecret;
    console.log("user :", user)
    return user;
  }
}

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email, },
    });

    if (!user.twoFA) {
      return user;
    }
    if (payload.isTwoFAuthenticated) {
      return user;
    }
  }
}