import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport";
import moduleDefaultExport from 'passport-42';

const FORTYTWO_APP_ID = 'u-s4t2ud-12a4791bc1e9337f0e3cbbb6c7cae559d63abdf9cb91679683df62ae4cd380b4';
const FORTYTWO_APP_SECRET = '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';

@Injectable() 
export class Api42Strategy extends PassportStrategy(moduleDefaultExport.Strategy) {
    constructor() {
        super({
            clientID: FORTYTWO_APP_ID,
            clientSecret: FORTYTWO_APP_SECRET,
            callbackURL: 'http://localhost:3333/api/auth/api42/redirect',
        });
    }
    async validate (accessToken: string, refreshToken: string, profile: any) {
        console.log("access token: ", accessToken);
        console.log("refresh token: ", refreshToken);
        console.log(profile);
    }
}