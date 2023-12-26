import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService,) {
    super({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
		secretOrKey: process.env.JWT_SECRET,
	});
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username};
  }

  // async validate(payload: {sub: number; username: string; }) {
  //   const user = await this.prisma.user.findUnique({
  //       where: {
  //         id: payload.sub,
  //       },
  //     });
  //   delete user.hash;
  //   console.log("user valide: ", user);
  //   return user;
  // }
}