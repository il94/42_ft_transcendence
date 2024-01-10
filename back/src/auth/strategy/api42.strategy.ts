import { Inject, Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport";
import moduleDefaultExport from "passport-42";
import { AuthService } from "../services/auth.service";

@Injectable() 
export class Api42Strategy extends PassportStrategy(moduleDefaultExport.Strategy) {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {
        super({
            clientID: process.env.FORTYTWO_APP_ID,
            clientSecret: process.env.FORTYTWO_APP_SECRET,
            callbackURL: 'http://localhost:3333/auth/api42/callback',
        });
    }
    async validate (accessToken: string, refreshToken: string, profile: moduleDefaultExport) {
        const user = await this.authService.validate42User({ email: profile.emails[0].value, username: profile.username });
        console.log("42 token : ", accessToken);
        return user;
    }
}

//validate(accessToken: string, refreshToken: string, profile: FortyTwoUser,): FortyTwoUser {return profile;}


// First elements of profile object from api42
// id: '108965',
// username: 'cchapon',
// displayName: 'Claire Chapon',
// name: { familyName: 'Chapon', givenName: 'Claire' },
// profileUrl: 'https://api.intra.42.fr/v2/users/cchapon',
// emails: [ { value: 'cchapon@student.42.fr' } ],
// phoneNumbers: [ { value: 'hidden' } ],
// photos: [ { value: undefined } ],
// provider: '42',