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
	avatar: string;

	@IsMobilePhone()
	tel: string;

}