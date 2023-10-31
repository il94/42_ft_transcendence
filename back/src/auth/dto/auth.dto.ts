import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class AuthDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	nickname: string;

	avatar: string;
}