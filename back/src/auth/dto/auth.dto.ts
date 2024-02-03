import { IsString, IsNotEmpty, IsNumberString, Length } from "class-validator";

export class AuthDto {

	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	hash: string;
}
