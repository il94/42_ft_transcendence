import { IsString, IsNotEmpty } from "class-validator";

export class AuthDto {

	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	hash: string;
}