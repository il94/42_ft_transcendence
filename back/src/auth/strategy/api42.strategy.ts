import { Inject, Injectable, BadRequestException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport";
import moduleDefaultExport from "passport-42";
import { AuthService } from "../services/auth.service";
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, catchError } from "rxjs";
import { Response } from 'express';

@Injectable() 
export class Api42Strategy extends PassportStrategy(moduleDefaultExport.Strategy) {
    constructor(@Inject(AuthService) private readonly authService: AuthService, private readonly httpService: HttpService,) {
        super({
            clientID: process.env.FORTYTWO_APP_ID,
            clientSecret: process.env.FORTYTWO_APP_SECRET,
            callbackURL: `${process.env.URL_BACK}/auth/api42/callback`,
        });
    }

    async validate (accessToken: string, refreshToken: string, profile: moduleDefaultExport) {
        const { data }  = await lastValueFrom(
            this.httpService.get(`https://api.intra.42.fr/v2/me`,
        { headers: { Authorization: `Bearer ${accessToken}`},}).pipe(
            catchError((error) => {
              if (typeof error.response === 'undefined')
                throw new BadRequestException(error.response?.data);
              else throw new BadRequestException(error.message);
            }),
          ),)
        const user = await this.authService.validate42User({
			usernameId: profile.username,
            avatar: data.image.link });
        return user;
    }
}