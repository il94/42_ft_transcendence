import { IsEmail, IsString, IsNotEmpty, IsMobilePhone, IsOptional } from "class-validator";

export class AuthDto {

	@IsString()
	@IsOptional()
	id42: string;

	@IsString()
	@IsNotEmpty()
	username: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	hash: string;

	@IsString()
	@IsOptional()
	avatar: string;

	@IsMobilePhone()
	@IsOptional()
	tel: string;

}