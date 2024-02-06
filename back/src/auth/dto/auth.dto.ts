import { IsString, IsNotEmpty, IsNumberString, Length } from "class-validator";

export class AuthDto {

	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	hash: string;
}
