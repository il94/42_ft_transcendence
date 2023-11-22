import { Inject, Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport";
import moduleDefaultExport from "passport-42";
import { AuthService } from "../auth.service";

@Injectable() 
export class Api42Strategy extends PassportStrategy(moduleDefaultExport.Strategy) {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {
        super({
            clientID: process.env.FORTYTWO_APP_ID,
            clientSecret: process.env.FORTYTWO_APP_SECRET,
            callbackURL: 'http://localhost:3333/api/auth/api42/redirect',
        });
    }
    async validate (accessToken: string, refreshToken: string, profile: moduleDefaultExport) {
        console.log("access token : ", accessToken);
		console.log("refresh token : ", refreshToken);
        const user = this.authService.validateUser({ email: profile.emails[0].value, username: profile.username, id42: profile.id }); 
        console.log ("User valide : ", user);
        return user || null;
    }
}

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