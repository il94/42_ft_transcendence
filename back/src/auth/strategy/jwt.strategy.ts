import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt,Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
		secretOrKey: process.env.AUTH_SECRET,
	});
  }

  async validate(payload: any) {
    console.log("dans validate");
    console.log({payload,});
    return { ...payload.user } ;
  }
}