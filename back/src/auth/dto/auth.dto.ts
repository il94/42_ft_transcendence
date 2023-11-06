import { IsEmail, IsString, IsNotEmpty, IsMobilePhone, IsOptional } from "class-validator";

export class AuthDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	nickname: string;

	@IsOptional()
//	avatar: string = process.env.AVATAR; // pas d erreur mais ne renvoie rien!
	avatar: string = "../other/stitch-logo.com.png"

	@IsMobilePhone()
	tel: string;

}