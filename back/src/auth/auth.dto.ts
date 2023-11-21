import { IsEmail, IsString, IsNotEmpty, IsMobilePhone, IsOptional } from "class-validator";

export class AuthDto {

	//@IsNotEmpty()
	@IsString()
	id42: string;

	@IsString()
	@IsNotEmpty()
	username: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsOptional()
	hash: string;

	@IsString()
	@IsOptional()
	avatar: string;

	@IsMobilePhone()
	@IsOptional()
	tel: string;

}